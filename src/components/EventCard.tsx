'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatDate, formatTime } from '@/lib/utils';
import type { Event } from '@/types/database';

interface EventCardProps {
  event: Event;
  isLoggedIn?: boolean;
  isMember?: boolean;
  onRsvp?: () => void;
}

const eventTypeLabels = {
  live_session: 'Live Session',
  workshop: 'Workshop',
  office_hours: 'Office Hours',
};

const eventTypeColors = {
  live_session: 'primary',
  workshop: 'success',
  office_hours: 'info',
} as const;

export function EventCard({ event, isLoggedIn = false, isMember = false, onRsvp }: EventCardProps) {
  const isPast = new Date(event.start_time) < new Date();
  const canAccess = !event.is_members_only || isMember;

  return (
    <Card variant="bordered" className={isPast ? 'opacity-60' : ''}>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="flex gap-2">
            <Badge variant={eventTypeColors[event.event_type]} size="sm">
              {eventTypeLabels[event.event_type]}
            </Badge>
            {event.is_members_only && (
              <Badge variant="warning" size="sm">
                Members Only
              </Badge>
            )}
          </div>
          {isPast && (
            <Badge variant="default" size="sm">
              Past
            </Badge>
          )}
        </div>
        <CardTitle className="mt-2">{event.title}</CardTitle>
        {event.description && (
          <CardDescription>{event.description}</CardDescription>
        )}
      </CardHeader>

      <CardContent>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span>{formatDate(event.start_time)}</span>
          </div>
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>
              {formatTime(event.start_time, event.timezone)} -{' '}
              {formatTime(event.end_time, event.timezone)}
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter>
        {isPast ? (
          <span className="text-sm text-gray-500">This event has passed</span>
        ) : !canAccess ? (
          <div className="flex flex-col gap-2 w-full">
            <p className="text-sm text-gray-500">
              Join as a member to access this event
            </p>
            <Button variant="outline" size="sm" className="w-full">
              <a href="/join">Become a Member</a>
            </Button>
          </div>
        ) : !isLoggedIn ? (
          <Button variant="outline" size="sm" className="w-full">
            <a href="/login">Sign in to RSVP</a>
          </Button>
        ) : (
          <Button onClick={onRsvp} variant="primary" size="sm" className="w-full">
            RSVP
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
