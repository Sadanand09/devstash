import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = "DevStash <onboarding@resend.dev>";

export async function sendVerificationEmail(
  email: string,
  token: string,
  name?: string | null
) {
  const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`;

  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: "Verify your DevStash email",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
        <h2 style="margin-bottom: 16px;">Welcome to DevStash${name ? `, ${name}` : ""}!</h2>
        <p style="color: #555; line-height: 1.6;">
          Please verify your email address by clicking the button below.
        </p>
        <a
          href="${verifyUrl}"
          style="display: inline-block; margin: 24px 0; padding: 12px 24px; background: #18181b; color: #fff; text-decoration: none; border-radius: 6px; font-weight: 500;"
        >
          Verify Email
        </a>
        <p style="color: #888; font-size: 14px; line-height: 1.5;">
          Or copy and paste this URL into your browser:<br/>
          <a href="${verifyUrl}" style="color: #555;">${verifyUrl}</a>
        </p>
        <p style="color: #888; font-size: 13px; margin-top: 32px;">
          This link expires in 24 hours. If you didn&apos;t create a DevStash account, you can ignore this email.
        </p>
      </div>
    `,
  });
}
