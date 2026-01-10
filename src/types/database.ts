export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          first_name: string | null;
          last_name: string | null;
          role: 'member' | 'admin';
          subscription_status: 'none' | 'active' | 'canceled' | 'past_due';
          stripe_customer_id: string | null;
          stripe_subscription_id: string | null;
          subscription_ends_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          first_name?: string | null;
          last_name?: string | null;
          role?: 'member' | 'admin';
          subscription_status?: 'none' | 'active' | 'canceled' | 'past_due';
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          subscription_ends_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          first_name?: string | null;
          last_name?: string | null;
          role?: 'member' | 'admin';
          subscription_status?: 'none' | 'active' | 'canceled' | 'past_due';
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          subscription_ends_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      leads: {
        Row: {
          id: string;
          lead_type: 'ai_for_admins_signup' | 'speaking_inquiry' | 'tool_interest';
          source: string;
          status: 'New' | 'Contacted' | 'Qualified' | 'Closed';
          email: string;
          first_name: string | null;
          last_name: string | null;
          full_name: string | null;
          company: string | null;
          role_title: string | null;
          linkedin_url: string | null;
          purpose: string | null;
          requested_topics: string | null;
          preferred_dates: string | null;
          session_length: string | null;
          format: string | null;
          attendee_count: string | null;
          budget_range: string | null;
          location_type: string | null;
          city: string | null;
          state_region: string | null;
          notes: string | null;
          tool_name: string | null;
          admin_notes: string | null;
          tags: string | null;
          assigned_to: string | null;
          consent_given: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          lead_type: 'ai_for_admins_signup' | 'speaking_inquiry' | 'tool_interest';
          source: string;
          status?: 'New' | 'Contacted' | 'Qualified' | 'Closed';
          email: string;
          first_name?: string | null;
          last_name?: string | null;
          full_name?: string | null;
          company?: string | null;
          role_title?: string | null;
          linkedin_url?: string | null;
          purpose?: string | null;
          requested_topics?: string | null;
          preferred_dates?: string | null;
          session_length?: string | null;
          format?: string | null;
          attendee_count?: string | null;
          budget_range?: string | null;
          location_type?: string | null;
          city?: string | null;
          state_region?: string | null;
          notes?: string | null;
          tool_name?: string | null;
          admin_notes?: string | null;
          tags?: string | null;
          assigned_to?: string | null;
          consent_given?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          lead_type?: 'ai_for_admins_signup' | 'speaking_inquiry' | 'tool_interest';
          source?: string;
          status?: 'New' | 'Contacted' | 'Qualified' | 'Closed';
          email?: string;
          first_name?: string | null;
          last_name?: string | null;
          full_name?: string | null;
          company?: string | null;
          role_title?: string | null;
          linkedin_url?: string | null;
          purpose?: string | null;
          requested_topics?: string | null;
          preferred_dates?: string | null;
          session_length?: string | null;
          format?: string | null;
          attendee_count?: string | null;
          budget_range?: string | null;
          location_type?: string | null;
          city?: string | null;
          state_region?: string | null;
          notes?: string | null;
          tool_name?: string | null;
          admin_notes?: string | null;
          tags?: string | null;
          assigned_to?: string | null;
          consent_given?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      events: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          event_type: 'live_session' | 'workshop' | 'office_hours';
          start_time: string;
          end_time: string;
          timezone: string;
          is_members_only: boolean;
          join_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          event_type: 'live_session' | 'workshop' | 'office_hours';
          start_time: string;
          end_time: string;
          timezone?: string;
          is_members_only?: boolean;
          join_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          event_type?: 'live_session' | 'workshop' | 'office_hours';
          start_time?: string;
          end_time?: string;
          timezone?: string;
          is_members_only?: boolean;
          join_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      event_rsvps: {
        Row: {
          id: string;
          event_id: string;
          user_id: string;
          rsvp_status: 'yes' | 'no' | 'maybe';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          event_id: string;
          user_id: string;
          rsvp_status?: 'yes' | 'no' | 'maybe';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          event_id?: string;
          user_id?: string;
          rsvp_status?: 'yes' | 'no' | 'maybe';
          created_at?: string;
          updated_at?: string;
        };
      };
      prompt_categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          icon: string | null;
          display_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          icon?: string | null;
          display_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          icon?: string | null;
          display_order?: number;
          created_at?: string;
        };
      };
      prompts: {
        Row: {
          id: string;
          category_id: string;
          title: string;
          description: string | null;
          prompt_text: string;
          use_cases: string | null;
          is_featured: boolean;
          copy_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          category_id: string;
          title: string;
          description?: string | null;
          prompt_text: string;
          use_cases?: string | null;
          is_featured?: boolean;
          copy_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          category_id?: string;
          title?: string;
          description?: string | null;
          prompt_text?: string;
          use_cases?: string | null;
          is_featured?: boolean;
          copy_count?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      lounge_categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          display_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          display_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          display_order?: number;
          created_at?: string;
        };
      };
      lounge_threads: {
        Row: {
          id: string;
          category_id: string;
          author_id: string;
          title: string;
          content: string;
          is_pinned: boolean;
          reply_count: number;
          last_activity_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          category_id: string;
          author_id: string;
          title: string;
          content: string;
          is_pinned?: boolean;
          reply_count?: number;
          last_activity_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          category_id?: string;
          author_id?: string;
          title?: string;
          content?: string;
          is_pinned?: boolean;
          reply_count?: number;
          last_activity_at?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      lounge_posts: {
        Row: {
          id: string;
          thread_id: string;
          author_id: string;
          content: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          thread_id: string;
          author_id: string;
          content: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          thread_id?: string;
          author_id?: string;
          content?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

// Convenience types
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Lead = Database['public']['Tables']['leads']['Row'];
export type Event = Database['public']['Tables']['events']['Row'];
export type EventRsvp = Database['public']['Tables']['event_rsvps']['Row'];
export type PromptCategory = Database['public']['Tables']['prompt_categories']['Row'];
export type Prompt = Database['public']['Tables']['prompts']['Row'];
export type LoungeCategory = Database['public']['Tables']['lounge_categories']['Row'];
export type LoungeThread = Database['public']['Tables']['lounge_threads']['Row'];
export type LoungePost = Database['public']['Tables']['lounge_posts']['Row'];

// Extended types with relationships
export type PromptWithCategory = Prompt & {
  category: PromptCategory;
};

export type ThreadWithAuthor = LoungeThread & {
  author: Pick<Profile, 'id' | 'first_name' | 'last_name' | 'email'>;
  category: LoungeCategory;
};

export type PostWithAuthor = LoungePost & {
  author: Pick<Profile, 'id' | 'first_name' | 'last_name' | 'email'>;
};

export type EventWithRsvp = Event & {
  rsvp?: EventRsvp;
  rsvpCount?: number;
};
