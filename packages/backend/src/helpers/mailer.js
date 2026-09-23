import nodemailer from 'nodemailer';
import appConfig from '@/config/app.js';

/**
 * Community Edition SMTP transport used by the email worker.
 * Built as a thin factory so callers receive a nodemailer Transporter.
 */
function buildSmtpTransport() {
  return nodemailer.createTransport({
    host: appConfig.smtpHost,
    port: appConfig.smtpPort,
    secure: appConfig.smtpSecure,
    auth: {
      user: appConfig.smtpUser,
      pass: appConfig.smtpPassword,
    },
  });
}

const mailer = buildSmtpTransport();

export default mailer;
