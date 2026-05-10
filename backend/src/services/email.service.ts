import nodemailer from 'nodemailer';
import { logger } from '../config/logger.js';

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
    const testAccount = await nodemailer.createTestAccount();
    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: { user: testAccount.user, pass: testAccount.pass },
    });

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

    logger.info(`Confirmation email preview URL: ${nodemailer.getTestMessageUrl(info)}`);
  },
};