import { NextResponse } from 'next/server';

// Generate a recurring .ics file for AI for Admins event
// First Thursday of every month at 2pm ET
export async function GET() {
  const now = new Date();
  const dtStamp = formatICSDate(now);

  // Calculate next occurrence (first Thursday of next month if past this month's)
  const nextEvent = getNextFirstThursday();
  const dtStart = formatICSDate(nextEvent);

  // Event ends 1 hour later
  const endEvent = new Date(nextEvent);
  endEvent.setHours(endEvent.getHours() + 1);
  const dtEnd = formatICSDate(endEvent);

  const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//EAwiz//AI for Admins//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:AI for Admins - EAwiz
X-WR-TIMEZONE:America/New_York
BEGIN:VTIMEZONE
TZID:America/New_York
BEGIN:DAYLIGHT
TZOFFSETFROM:-0500
TZOFFSETTO:-0400
TZNAME:EDT
DTSTART:19700308T020000
RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU
END:DAYLIGHT
BEGIN:STANDARD
TZOFFSETFROM:-0400
TZOFFSETTO:-0500
TZNAME:EST
DTSTART:19701101T020000
RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU
END:STANDARD
END:VTIMEZONE
BEGIN:VEVENT
DTSTAMP:${dtStamp}
UID:ai-for-admins@eawiz.com
DTSTART;TZID=America/New_York:${dtStart}
DTEND;TZID=America/New_York:${dtEnd}
RRULE:FREQ=MONTHLY;BYDAY=1TH
SUMMARY:AI for Admins - EAwiz
DESCRIPTION:Join us for live AI training\\, demos\\, and Q&A with the EAwiz team. Free for everyone!\\n\\nZoom Link: https://us02web.zoom.us/j/81234567890\\n\\nLearn more at https://eawiz.com/events
LOCATION:https://us02web.zoom.us/j/81234567890
URL:https://eawiz.com/events
ORGANIZER;CN=EAwiz:mailto:hello@eawiz.com
STATUS:CONFIRMED
SEQUENCE:0
END:VEVENT
END:VCALENDAR`;

  return new NextResponse(icsContent, {
    status: 200,
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': 'attachment; filename="ai-for-admins.ics"',
    },
  });
}

function formatICSDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}${month}${day}T${hours}${minutes}${seconds}`;
}

function getNextFirstThursday(): Date {
  const now = new Date();
  let year = now.getFullYear();
  let month = now.getMonth();

  // Find first Thursday of current month
  let firstThursday = getFirstThursdayOfMonth(year, month);

  // Set time to 2pm ET
  firstThursday.setHours(14, 0, 0, 0);

  // If past this month's event, get next month's
  if (now > firstThursday) {
    month++;
    if (month > 11) {
      month = 0;
      year++;
    }
    firstThursday = getFirstThursdayOfMonth(year, month);
    firstThursday.setHours(14, 0, 0, 0);
  }

  return firstThursday;
}

function getFirstThursdayOfMonth(year: number, month: number): Date {
  const firstDay = new Date(year, month, 1);
  const dayOfWeek = firstDay.getDay();
  // Thursday is day 4
  const daysUntilThursday = (4 - dayOfWeek + 7) % 7;
  return new Date(year, month, 1 + daysUntilThursday);
}
