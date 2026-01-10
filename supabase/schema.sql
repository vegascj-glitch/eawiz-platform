-- ===========================================
-- EAwiz Platform Database Schema
-- ===========================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===========================================
-- PROFILES TABLE
-- ===========================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  role TEXT DEFAULT 'member' CHECK (role IN ('member', 'admin')),
  subscription_status TEXT DEFAULT 'none' CHECK (subscription_status IN ('none', 'active', 'canceled', 'past_due')),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  subscription_ends_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ===========================================
-- LEADS TABLE
-- ===========================================
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_type TEXT NOT NULL CHECK (lead_type IN ('ai_for_admins_signup', 'speaking_inquiry', 'tool_interest')),
  source TEXT NOT NULL,
  status TEXT DEFAULT 'New' CHECK (status IN ('New', 'Contacted', 'Qualified', 'Closed')),

  -- Common fields
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  full_name TEXT,
  company TEXT,
  role_title TEXT,
  linkedin_url TEXT,

  -- Speaking inquiry fields
  purpose TEXT,
  requested_topics TEXT,
  preferred_dates TEXT,
  session_length TEXT,
  format TEXT,
  attendee_count TEXT,
  budget_range TEXT,
  location_type TEXT,
  city TEXT,
  state_region TEXT,
  notes TEXT,

  -- Tool interest fields
  tool_name TEXT,

  -- Admin fields
  admin_notes TEXT,
  tags TEXT,
  assigned_to UUID REFERENCES profiles(id),

  -- Consent
  consent_given BOOLEAN DEFAULT FALSE,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- EVENTS TABLE
-- ===========================================
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  event_type TEXT NOT NULL CHECK (event_type IN ('live_session', 'workshop', 'office_hours')),
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  timezone TEXT DEFAULT 'America/New_York',
  is_members_only BOOLEAN DEFAULT FALSE,
  join_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- EVENT RSVPS TABLE
-- ===========================================
CREATE TABLE event_rsvps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  rsvp_status TEXT DEFAULT 'yes' CHECK (rsvp_status IN ('yes', 'no', 'maybe')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

-- ===========================================
-- PROMPT CATEGORIES TABLE
-- ===========================================
CREATE TABLE prompt_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- PROMPTS TABLE
-- ===========================================
CREATE TABLE prompts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID NOT NULL REFERENCES prompt_categories(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  prompt_text TEXT NOT NULL,
  use_cases TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  copy_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- LOUNGE CATEGORIES TABLE
-- ===========================================
CREATE TABLE lounge_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- LOUNGE THREADS TABLE
-- ===========================================
CREATE TABLE lounge_threads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID NOT NULL REFERENCES lounge_categories(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  is_pinned BOOLEAN DEFAULT FALSE,
  reply_count INT DEFAULT 0,
  last_activity_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- LOUNGE POSTS (REPLIES) TABLE
-- ===========================================
CREATE TABLE lounge_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  thread_id UUID NOT NULL REFERENCES lounge_threads(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger to update thread reply count and last activity
CREATE OR REPLACE FUNCTION update_thread_on_post()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE lounge_threads
  SET
    reply_count = reply_count + 1,
    last_activity_at = NOW()
  WHERE id = NEW.thread_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_lounge_post_created
  AFTER INSERT ON lounge_posts
  FOR EACH ROW EXECUTE FUNCTION update_thread_on_post();

-- ===========================================
-- ROW LEVEL SECURITY POLICIES
-- ===========================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompt_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE lounge_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE lounge_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE lounge_posts ENABLE ROW LEVEL SECURITY;

-- PROFILES POLICIES
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- LEADS POLICIES
CREATE POLICY "Anyone can insert leads" ON leads
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view all leads" ON leads
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can update leads" ON leads
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- EVENTS POLICIES
CREATE POLICY "Anyone can view events" ON events
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage events" ON events
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- EVENT RSVPS POLICIES
CREATE POLICY "Members can view own RSVPs" ON event_rsvps
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Members can create RSVPs" ON event_rsvps
  FOR INSERT WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND subscription_status = 'active')
  );

CREATE POLICY "Members can update own RSVPs" ON event_rsvps
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all RSVPs" ON event_rsvps
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- PROMPT CATEGORIES POLICIES
CREATE POLICY "Members can view prompt categories" ON prompt_categories
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND subscription_status = 'active')
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- PROMPTS POLICIES
CREATE POLICY "Members can view prompts" ON prompts
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND subscription_status = 'active')
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- LOUNGE CATEGORIES POLICIES
CREATE POLICY "Members can view lounge categories" ON lounge_categories
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND subscription_status = 'active')
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- LOUNGE THREADS POLICIES
CREATE POLICY "Members can view lounge threads" ON lounge_threads
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND subscription_status = 'active')
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Members can create lounge threads" ON lounge_threads
  FOR INSERT WITH CHECK (
    auth.uid() = author_id AND
    (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND subscription_status = 'active')
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
  );

CREATE POLICY "Authors can update own threads" ON lounge_threads
  FOR UPDATE USING (auth.uid() = author_id);

-- LOUNGE POSTS POLICIES
CREATE POLICY "Members can view lounge posts" ON lounge_posts
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND subscription_status = 'active')
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Members can create lounge posts" ON lounge_posts
  FOR INSERT WITH CHECK (
    auth.uid() = author_id AND
    (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND subscription_status = 'active')
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
  );

CREATE POLICY "Authors can update own posts" ON lounge_posts
  FOR UPDATE USING (auth.uid() = author_id);

-- ===========================================
-- INDEXES
-- ===========================================
CREATE INDEX idx_leads_lead_type ON leads(lead_type);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX idx_events_start_time ON events(start_time);
CREATE INDEX idx_prompts_category ON prompts(category_id);
CREATE INDEX idx_lounge_threads_category ON lounge_threads(category_id);
CREATE INDEX idx_lounge_threads_last_activity ON lounge_threads(last_activity_at DESC);
