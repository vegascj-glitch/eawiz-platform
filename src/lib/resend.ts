import { Resend } from 'resend';

export const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.FROM_EMAIL || 'EAwiz <hello@eawiz.com>';

export async function sendWelcomeEmail(email: string, firstName?: string) {
  const { data, error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: 'Welcome to EAwiz!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #0ea5e9;">Welcome to EAwiz!</h1>
        <p>Hi ${firstName || 'there'},</p>
        <p>Thank you for joining the EAwiz community! You now have access to:</p>
        <ul>
          <li><strong>380+ AI Prompts</strong> - Curated specifically for Executive Assistants</li>
          <li><strong>The EAwiz Lounge</strong> - Connect with fellow EAs</li>
          <li><strong>Live Events</strong> - Workshops, office hours, and AI for Admins sessions</li>
          <li><strong>AI Tools</strong> - Including our Calendar Audit tool</li>
        </ul>
        <p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/prompts"
             style="background-color: #0ea5e9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Explore Prompts
          </a>
        </p>
        <p>Questions? Just reply to this email - we're here to help!</p>
        <p>Best,<br>The EAwiz Team</p>
      </div>
    `,
  });

  if (error) {
    console.error('Failed to send welcome email:', error);
    throw error;
  }

  return data;
}

export async function sendLeadNotificationEmail(lead: {
  email: string;
  firstName?: string;
  lastName?: string;
  leadType: string;
  source: string;
  company?: string;
}) {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@eawiz.com';

  const { data, error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: adminEmail,
    subject: `New Lead: ${lead.leadType} from ${lead.source}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #0ea5e9;">New Lead Received</h1>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Type:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${lead.leadType}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Source:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${lead.source}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Name:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${lead.firstName || ''} ${lead.lastName || ''}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Email:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${lead.email}</td>
          </tr>
          ${lead.company ? `
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Company:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${lead.company}</td>
          </tr>
          ` : ''}
        </table>
        <p style="margin-top: 20px;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/leads"
             style="background-color: #0ea5e9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            View in Dashboard
          </a>
        </p>
      </div>
    `,
  });

  if (error) {
    console.error('Failed to send lead notification email:', error);
    throw error;
  }

  return data;
}

export async function sendSpeakingInquiryConfirmation(email: string, firstName?: string) {
  const { data, error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: 'Speaking Inquiry Received - EAwiz',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #0ea5e9;">Thank You for Your Inquiry</h1>
        <p>Hi ${firstName || 'there'},</p>
        <p>Thank you for your interest in booking a speaking engagement with EAwiz!</p>
        <p>We've received your inquiry and will review the details. You can expect to hear back from us within 2-3 business days.</p>
        <p>In the meantime, feel free to check out our free resources:</p>
        <ul>
          <li><a href="${process.env.NEXT_PUBLIC_APP_URL}/tools">AI Tools for EAs</a></li>
          <li><a href="${process.env.NEXT_PUBLIC_APP_URL}/events">Upcoming Events</a></li>
        </ul>
        <p>Best,<br>The EAwiz Team</p>
      </div>
    `,
  });

  if (error) {
    console.error('Failed to send speaking inquiry confirmation:', error);
    throw error;
  }

  return data;
}
