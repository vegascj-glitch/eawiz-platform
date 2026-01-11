import { createServerSupabaseClient, getProfile, isActiveMember } from '@/lib/supabase-server';
import { EventCard } from '@/components/EventCard';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import type { Event } from '@/types/database';

export default async function EventsPage() {
  const supabase = await createServerSupabaseClient();
  const profile = await getProfile();
  const isMember = await isActiveMember();

  const { data: events } = await supabase
    .from('events')
    .select('*')
    .order('start_time', { ascending: true }) as { data: Event[] | null };

  const upcomingEvents = events?.filter((e) => new Date(e.start_time) >= new Date()) || [];
  const pastEvents = events?.filter((e) => new Date(e.start_time) < new Date()) || [];

  return (
    <>
      {/* Header */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="container py-12">
          <h1 className="text-4xl font-bold text-center">Events</h1>
          <p className="mt-4 text-lg text-primary-100 text-center max-w-2xl mx-auto">
            Join our live sessions, workshops, and community office hours
          </p>
        </div>
      </section>

      <section className="section bg-gray-50">
        <div className="container">
          {/* AI for Admins Callout */}
          <div className="bg-primary-50 border border-primary-200 rounded-xl p-6 mb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-primary-900">
                  AI for Admins Monthly Sessions
                </h2>
                <p className="text-primary-700 mt-1">
                  Free monthly sessions covering practical AI prompts for Executive Assistants.
                  Everyone welcome!
                </p>
              </div>
              <Link href="/speaking">
                <Button variant="primary">Learn More</Button>
              </Link>
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Upcoming Events ({upcomingEvents.length})
            </h2>
            {upcomingEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingEvents.map((event: Event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    isLoggedIn={!!profile}
                    isMember={isMember}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-white rounded-xl border border-gray-200">
                <p className="text-gray-500">No upcoming events scheduled.</p>
                <p className="text-gray-500 mt-1">Check back soon!</p>
              </div>
            )}
          </div>

          {/* Past Events */}
          {pastEvents.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Past Events</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pastEvents.slice(0, 6).map((event: Event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Member CTA */}
      {!isMember && (
        <section className="section bg-white">
          <div className="container text-center">
            <h2 className="text-2xl font-bold text-gray-900">
              Get Access to Member-Only Events
            </h2>
            <p className="mt-4 text-gray-600 max-w-xl mx-auto">
              Members get access to exclusive workshops, office hours, and early
              registration for all events.
            </p>
            <div className="mt-8">
              <Link href="/join">
                <Button variant="primary" size="lg">
                  Become a Member
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
