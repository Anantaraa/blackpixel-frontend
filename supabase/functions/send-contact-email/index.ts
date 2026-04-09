import { createClient } from 'jsr:@supabase/supabase-js@2';
import nodemailer from 'npm:nodemailer@6';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { name, email, mobile, message } = await req.json();

    // Basic validation
    if (!name || !message || (!email && !mobile)) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // Save to Supabase
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const { error: dbError } = await supabase.from('contact_submissions').insert({
      name,
      email: email || null,
      mobile: mobile || null,
      message,
    });

    if (dbError) {
      console.error('DB error:', dbError);
      return new Response(
        JSON.stringify({ error: 'Failed to save submission.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // Send email via SMTP
    const transporter = nodemailer.createTransport({
      host: Deno.env.get('SMTP_HOST'),
      port: Number(Deno.env.get('SMTP_PORT') ?? 587),
      secure: Deno.env.get('SMTP_SECURE') === 'true', // true for port 465
      auth: {
        user: Deno.env.get('SMTP_USER'),
        pass: Deno.env.get('SMTP_PASS'),
      },
    });

    await transporter.sendMail({
      from: `"BlackPixel Contact Form" <${Deno.env.get('SMTP_USER')}>`,
      to: 'studio@blackpixel3d.com',
      replyTo: email || undefined,
      subject: `New Inquiry from ${name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
          <h2 style="margin-bottom: 24px;">New Contact Inquiry</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px 0; color: #666; width: 120px;">Name</td>
              <td style="padding: 10px 0; font-weight: 500;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #666;">Email</td>
              <td style="padding: 10px 0;">${email || '—'}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #666;">Mobile</td>
              <td style="padding: 10px 0;">${mobile || '—'}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #666; vertical-align: top;">Message</td>
              <td style="padding: 10px 0; white-space: pre-line;">${message}</td>
            </tr>
          </table>
        </div>
      `,
    });

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (err) {
    console.error('Edge function error:', err);
    return new Response(
      JSON.stringify({ error: 'Internal server error.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});
