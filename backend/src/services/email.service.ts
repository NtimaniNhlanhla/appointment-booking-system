import nodemailer from 'nodemailer';
import { logger } from '../config/logger.js';
import { env } from '../config/env.js';

async function createTransporter() {
  if (env.SMTP_HOST) {
    // Docker: use Mailpit (or any configured SMTP)
    return nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT ?? 1025,
      secure: false,
      ignoreTLS: true,
    });
  }

  // Local dev fallback: Ethereal
  const testAccount = await nodemailer.createTestAccount();
  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: { user: testAccount.user, pass: testAccount.pass },
  });
}

export const emailService = {
  async sendConfirmation(booking: {
    customerName: string;
    customerEmail: string;
    bookingReference: string;
    branchName: string;
    slotDate: string;
    startTime: string;
    endTime: string;
  }) {
    const transporter = await createTransporter();

    const info = await transporter.sendMail({
      from: '"Appointment Booking" <no-reply@appointments.co.za>',
      to: booking.customerEmail,
      subject: `Booking Confirmed: ${booking.bookingReference}`,
      html: `
        <h1>Appointment Confirmed</h1>
        <p>Dear ${booking.customerName},</p>
        <p>Your appointment has been confirmed.</p>
        <ul>
          <li><strong>Reference:</strong> ${booking.bookingReference}</li>
          <li><strong>Branch:</strong> ${booking.branchName}</li>
          <li><strong>Date:</strong> ${booking.slotDate}</li>
          <li><strong>Time:</strong> ${booking.startTime} – ${booking.endTime}</li>
        </ul>
      `,
    });

    if (env.SMTP_HOST) {
      logger.info(`Email sent to Mailpit — view at http://localhost:8025`);
    } else {
      logger.info(`Ethereal preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    }
  },
};