import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getResend } from '@/lib/resend';

const ADMIN_NOTIFY_EMAIL = 'vegascj@gmail.com';

// Lazy initialization to avoid build-time errors
function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(req: Request) {
  try {
    const data = await req.json();

    // Validate required fields
    const requiredFields = [
      'name',
      'email',
      'projectType',
      'budget',
      'timeline',
      'description',
      'hearAbout',
    ];

    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Parse name into first/last
    const nameParts = data.name.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    // Insert into leads table
    const { error: dbError } = await getSupabaseAdmin().from('leads').insert({
      lead_type: 'app_dev_inquiry',
      source: data.hearAbout || 'app_dev_form',
      email: data.email,
      first_name: firstName,
      last_name: lastName,
      full_name: data.name,
      company: data.company || '',
      purpose: data.projectType,
      budget_range: data.budget,
      notes: `Project Type: ${data.projectType}\nTimeline: ${data.timeline}\nCurrent Tools: ${data.currentTools || 'Not specified'}\n\nDescription:\n${data.description}`,
      consent_given: true,
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
      await getResend().emails.send({
        from: process.env.FROM_EMAIL || 'EAwiz <hello@eawiz.com>',
        to: ADMIN_NOTIFY_EMAIL,
        subject: `New App Dev Inquiry: ${data.projectType}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #0ea5e9;">New Custom App Development Inquiry</h1>

            <h2 style="color: #333; border-bottom: 1px solid #eee; padding-bottom: 8px;">Contact Information</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;"><strong>Name:</strong></td>
                <td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;">${data.name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;"><strong>Email:</strong></td>
                <td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;"><a href="mailto:${data.email}">${data.email}</a></td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;"><strong>Company:</strong></td>
                <td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;">${data.company || 'Not provided'}</td>
              </tr>
            </table>

            <h2 style="color: #333; border-bottom: 1px solid #eee; padding-bottom: 8px; margin-top: 24px;">Project Details</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;"><strong>Project Type:</strong></td>
                <td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;">${data.projectType}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;"><strong>Budget Range:</strong></td>
                <td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;">${data.budget}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;"><strong>Timeline:</strong></td>
                <td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;">${data.timeline}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;"><strong>Current Tools:</strong></td>
                <td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;">${data.currentTools || 'Not specified'}</td>
              </tr>
            </table>

            <h2 style="color: #333; border-bottom: 1px solid #eee; padding-bottom: 8px; margin-top: 24px;">Project Description</h2>
            <p style="background: #f9f9f9; padding: 12px; border-radius: 4px; white-space: pre-wrap;">${data.description}</p>

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
      await getResend().emails.send({
        from: process.env.FROM_EMAIL || 'EAwiz <hello@eawiz.com>',
        to: data.email,
        subject: 'Project Inquiry Received - EAwiz',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #0ea5e9;">Thank You for Your Inquiry</h1>
            <p>Hi ${firstName || 'there'},</p>
            <p>Thank you for your interest in custom app development with EAwiz!</p>
            <p>We've received your inquiry and will review the project details. You can expect to hear back from us within 1-2 business days.</p>
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
    console.error('App dev inquiry error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
