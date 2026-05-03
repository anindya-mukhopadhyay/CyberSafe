import nodemailer from 'nodemailer';

const isEmailEnabled = () => {
  const explicitlyEnabled = process.env.ENABLE_EMAIL_ALERTS === 'true';
  const hasSmtpConfig =
    process.env.SMTP_HOST &&
    process.env.SMTP_PORT &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASS &&
    process.env.FROM_EMAIL;

  return explicitlyEnabled && hasSmtpConfig;
};

const getTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

export const sendEmailAlert = async ({ to, subject, text, html }) => {
  if (!isEmailEnabled()) {
    return { skipped: true, reason: 'Email alerts not configured or disabled' };
  }

  const transporter = getTransporter();
  await transporter.sendMail({
    from: process.env.FROM_EMAIL,
    to,
    subject,
    text,
    html,
  });

  return { skipped: false };
};
