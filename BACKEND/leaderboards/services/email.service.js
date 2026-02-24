// ==========================================
// src/services/email.service.js
// ==========================================
const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD,
            },
        });
    }

    async sendOTP(email, otp) {
        try {
            const mailOptions = {
                from: process.env.SMTP_USER,
                to: email,
                subject: 'Your OTP Code',
                html: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>Your OTP Code</h2>
            <p>Your OTP code is:</p>
            <h1 style="color: #4F46E5; letter-spacing: 5px;">${otp}</h1>
            <p>This code will expire in 5 minutes.</p>
            <p>If you didn't request this code, please ignore this email.</p>
          </div>
        `,
            };

            const mail = await this.transporter.sendMail(mailOptions);
            if (mail) {
                logger.info(`OTP email sent to: ${email.substring(0, 3)}***`);
                return { success: true };
            }
            else {
                throw new Error('Failed to send email');
            }
        } catch (error) {
            logger.error('Email sending error:', error);
            throw new Error('Failed to send email');
        }
    }

    async sendPasswordResetEmail(email, resetLink) {
        try {
            const mailOptions = {
                from: process.env.SMTP_USER,
                to: email,
                subject: 'Password Reset Request',
                html: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>Password Reset Request</h2>
            <p>You requested to reset your password. Click the link below:</p>
            <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
            <p>This link will expire in 1 hour.</p>
            <p>If you didn't request this, please ignore this email.</p>
          </div>
        `,
            };

            await this.transporter.sendMail(mailOptions);
            logger.info(`Password reset email sent to: ${email.substring(0, 3)}***`);
            return { success: true };
        } catch (error) {
            logger.error('Email sending error:', error);
            throw new Error('Failed to send email');
        }
    }
}

module.exports = new EmailService();
