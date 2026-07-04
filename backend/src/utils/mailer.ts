import nodemailer from 'nodemailer';
import { env } from '../config/env.js';

export const sendVerificationEmail = async (email: string, otp: string): Promise<void> => {
  const isSmtpConfigured = env.SMTP_HOST && env.SMTP_PORT && env.SMTP_USER && env.SMTP_PASS;

  if (isSmtpConfigured) {
    const transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: parseInt(env.SMTP_PORT || '587', 10),
      secure: env.SMTP_PORT === '465',
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: env.SMTP_FROM || `"FinanceFlow" <no-reply@financeflow.com>`,
      to: email,
      subject: 'Verify Your Email Address - FinanceFlow',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px;">
          <h2 style="color: #4f46e5; margin-bottom: 16px;">FinanceFlow</h2>
          <p style="color: #374151; font-size: 16px; line-height: 1.5;">Thank you for registering. Please verify your email address by entering the 6-digit verification code below:</p>
          <div style="background-color: #f3f4f6; padding: 16px; border-radius: 8px; text-align: center; margin: 24px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #111827;">${otp}</span>
          </div>
          <p style="color: #6b7280; font-size: 14px; line-height: 1.5;">This code will expire in 5 minutes. If you did not request this, you can ignore this email.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
  } else {
    // Fallback: Mock logging in development
    console.log('\n=============================================');
    console.log(`[MAILER MOCK] To: ${email}`);
    console.log(`[MAILER MOCK] Subject: Verify Your Email Address`);
    console.log(`[MAILER MOCK] OTP Verification Code: ${otp}`);
    console.log('=============================================\n');
  }
};
