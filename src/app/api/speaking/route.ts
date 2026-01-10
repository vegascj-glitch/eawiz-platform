import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { resend } from '@/lib/resend';
import type { Database } from '@/types/database';

const ADMIN_NOTIFY_EMAIL = 'vegascj@gmail.com';

// Use service role for API routes
const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const data = await req.json();

    // Validate required fields
    const requiredFields = [
      'firstName',
      'lastName',
      'email',
      'organization',
      'roleTitle',
      'eventName',
      'eventType',
      'audienceType',
      'audienceSize',
      'eventDate',
      'timezone',
      'eventFormat',
      'budgetRange',
      'outcomes',
      'hearAbout',
      'consent',
    ];

    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    if (!data.consent) {
      return NextResponse.json(
        { error: 'Consent is required' },
        { status: 400 }
      );
    }

    // Insert into leads table
    const { error: dbError } = await supabaseAdmin.from('leads').insert({
      lead_type: 'speaking_inquiry',
      source: data.hearAbout || 'speaking_form',
      email: data.email,
      first_name: data.firstName,
      last_name: data.lastName,
      full_name: `${data.firstName} ${data.lastName}`,
      company: data.organization,
      role_title: data.roleTitle,
      purpose: data.eventName,
      requested_topics: Array.isArray(data.topics) ? data.topics.join(', ') : '',
      preferred_dates: data.eventDate,
      session_length: data.eventType,
      format: data.eventFormat,
      attendee_count: data.audienceSize,
      budget_range: data.budgetRange,
      location_type: data.eventFormat,
      city: data.location || '',
      notes: `Audience Type: ${data.audienceType}\nTimezone: ${data.timezone}\nOutcomes: ${data.outcomes}\nAdditional Notes: ${data.additionalNotes || 'N/A'}`,
      consent_given: data.consent,
    });

    if (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { error: 'Failed to save inquiry' },
        { status: 500 }
      );
    }

    // Send admin notification email
    try {
      await resend.emails.send({
        from: process.env.FROM_EMAIL || 'EAwiz <hello@eawiz.com>',
        to: ADMIN_NOTIFY_EMAIL,
        subject: `New Speaking Inquiry: ${data.eventName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #0ea5e9;">New Speaking Engagement Inquiry</h1>

            <h2 style="color: #333; border-bottom: 1px solid #eee; padding-bottom: 8px;">Contact Information</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;"><strong>Name:</strong></td>
                <td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;">${data.firstName} ${data.lastName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;"><strong>Email:</strong></td>
                <td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;"><a href="mailto:${data.email}">${data.email}</a></td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;"><strong>Phone:</strong></td>
                <td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;">${data.phone || 'Not provided'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;"><strong>Organization:</strong></td>
                <td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;">${data.organization}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;"><strong>Role/Title:</strong></td>
                <td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;">${data.roleTitle}</td>
              </tr>
            </table>

            <h2 style="color: #333; border-bottom: 1px solid #eee; padding-bottom: 8px; margin-top: 24px;">Event Details</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;"><strong>Event Name:</strong></td>
                <td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;">${data.eventName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;"><strong>Event Type:</strong></td>
                <td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;">${data.eventType}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;"><strong>Audience Type:</strong></td>
                <td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;">${data.audienceType}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;"><strong>Audience Size:</strong></td>
                <td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;">${data.audienceSize}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;"><strong>Event Date:</strong></td>
                <td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;">${data.eventDate}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;"><strong>Timezone:</strong></td>
                <td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;">${data.timezone}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;"><strong>Format:</strong></td>
                <td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;">${data.eventFormat}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;"><strong>Location:</strong></td>
                <td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;">${data.location || 'N/A (Virtual)'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;"><strong>Budget Range:</strong></td>
                <td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;">${data.budgetRange}</td>
              </tr>
            </table>

            <h2 style="color: #333; border-bottom: 1px solid #eee; padding-bottom: 8px; margin-top: 24px;">Topics & Goals</h2>
            <p><strong>Topics of Interest:</strong></p>
            <p>${Array.isArray(data.topics) && data.topics.length > 0 ? data.topics.join(', ') : 'None specified'}</p>

            <p><strong>Requested Outcomes/Goals:</strong></p>
            <p style="background: #f9f9f9; padding: 12px; border-radius: 4px;">${data.outcomes}</p>

            ${data.additionalNotes ? `
            <p><strong>Additional Notes:</strong></p>
            <p style="background: #f9f9f9; padding: 12px; border-radius: 4px;">${data.additionalNotes}</p>
            ` : ''}

            <p><strong>How they heard about EAwiz:</strong> ${data.hearAbout}</p>

            <p style="margin-top: 24px;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/leads"
                 style="background-color: #0ea5e9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                View in Dashboard
              </a>
            </p>
          </div>
        `,
      });
    } catch (emailError) {
      console.error('Failed to send admin notification email:', emailError);
      // Don't fail the request if email fails
    }

    // Send confirmation email to requester
    try {
      await resend.emails.send({
        from: process.env.FROM_EMAIL || 'EAwiz <hello@eawiz.com>',
        to: data.email,
        subject: 'Speaking Inquiry Received - EAwiz',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #0ea5e9;">Thank You for Your Inquiry</h1>
            <p>Hi ${data.firstName},</p>
            <p>Thank you for your interest in booking a speaking engagement with EAwiz!</p>
            <p>We've received your inquiry for <strong>${data.eventName}</strong> and will review the details. You can expect to hear back from us within 2-3 business days.</p>
            <p>In the meantime, feel free to check out our free resources:</p>
            <ul>
              <li><a href="${process.env.NEXT_PUBLIC_APP_URL}/tools">AI Tools for EAs</a></li>
              <li><a href="${process.env.NEXT_PUBLIC_APP_URL}/events">Upcoming Events</a></li>
            </ul>
            <p>Best,<br>The EAwiz Team</p>
          </div>
        `,
      });
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Speaking inquiry error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
