import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import * as nodemailer from 'nodemailer'

@Injectable()
export class EmailService implements OnModuleInit {
  private readonly logger = new Logger(EmailService.name)
  private transporter: nodemailer.Transporter
  private isEmailConfigured = false

  constructor() {
    // Initialize email transporter
    // Supports multiple email providers (Gmail, SendGrid, SMTP, etc.)
    const emailConfig = {
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER || process.env.EMAIL_USER,
        pass: process.env.SMTP_PASS || process.env.EMAIL_PASSWORD,
      },
    }

    // If using Gmail with OAuth2, use different config
    if (process.env.EMAIL_PROVIDER === 'gmail-oauth2') {
      if (process.env.GMAIL_CLIENT_ID && process.env.GMAIL_CLIENT_SECRET) {
        this.transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            type: 'OAuth2',
            user: process.env.EMAIL_USER,
            clientId: process.env.GMAIL_CLIENT_ID,
            clientSecret: process.env.GMAIL_CLIENT_SECRET,
            refreshToken: process.env.GMAIL_REFRESH_TOKEN,
          },
        })
        this.isEmailConfigured = true
      }
    } else if (process.env.EMAIL_PROVIDER === 'sendgrid') {
      // SendGrid uses API key
      if (process.env.SENDGRID_API_KEY) {
        this.transporter = nodemailer.createTransport({
          service: 'SendGrid',
          auth: {
            user: 'apikey',
            pass: process.env.SENDGRID_API_KEY,
          },
        })
        this.isEmailConfigured = true
      }
    } else {
      // Standard SMTP
      const smtpUser = process.env.SMTP_USER || process.env.EMAIL_USER
      const smtpPass = process.env.SMTP_PASS || process.env.EMAIL_PASSWORD
      
      if (smtpUser && smtpPass) {
        this.transporter = nodemailer.createTransport(emailConfig)
        this.isEmailConfigured = true
      }
    }
  }

  async onModuleInit() {
    if (this.isEmailConfigured) {
      try {
        // Verify email configuration
        await this.transporter.verify()
        this.logger.log('✅ Email service configured and verified successfully!')
        this.logger.log(`📧 Email Provider: ${process.env.EMAIL_PROVIDER || 'smtp'}`)
        this.logger.log(`📧 SMTP Host: ${process.env.SMTP_HOST || 'smtp.gmail.com'}`)
        this.logger.log(`📧 From Address: ${process.env.EMAIL_FROM || process.env.SMTP_USER || process.env.EMAIL_USER || 'Not set'}`)
      } catch (error) {
        this.logger.warn(`⚠️  Email service configuration issue: ${error.message}`)
        this.logger.warn('📧 Email sending may fail. Check your SMTP credentials in .env file')
      }
    } else {
      this.logger.warn('⚠️  Email service not configured!')
      this.logger.warn('📧 To enable email verification, add SMTP credentials to .env file:')
      this.logger.warn('   SMTP_USER=your-email@gmail.com')
      this.logger.warn('   SMTP_PASS=your-app-password')
      this.logger.warn('   EMAIL_FROM="Security App <your-email@gmail.com>"')
    }
  }

  async sendVerificationEmail(email: string, name: string, token: string) {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000'
    const verificationUrl = `${frontendUrl}/verify-email?token=${token}`

    const mailOptions = {
      from: `"Security App" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Verify Your Email Address - Security App',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify Your Email</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #10b981 0%, #3b82f6 100%); padding: 30px; border-radius: 12px; text-align: center; margin-bottom: 30px;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Security App</h1>
          </div>
          
          <div style="background: #ffffff; padding: 30px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <h2 style="color: #1f2937; margin-top: 0;">Welcome, ${name}!</h2>
            
            <p style="color: #4b5563; font-size: 16px;">
              Thank you for registering with Security App. To complete your registration and start using our services, please verify your email address by clicking the button below.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationUrl}" 
                 style="display: inline-block; background: #10b981; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                Verify Email Address
              </a>
            </div>
            
            <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
              If the button doesn't work, copy and paste this link into your browser:
            </p>
            <p style="color: #3b82f6; font-size: 12px; word-break: break-all; background: #f3f4f6; padding: 12px; border-radius: 6px;">
              ${verificationUrl}
            </p>
            
            <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
              This verification link will expire in 24 hours. If you didn't create an account, please ignore this email.
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; color: #9ca3af; font-size: 12px;">
            <p>© ${new Date().getFullYear()} Security App. All rights reserved.</p>
            <p>This is an automated email, please do not reply.</p>
          </div>
        </body>
        </html>
      `,
      text: `
        Welcome to Security App, ${name}!
        
        Please verify your email address by clicking the following link:
        ${verificationUrl}
        
        This link will expire in 24 hours.
        
        If you didn't create an account, please ignore this email.
      `,
    }

    if (!this.isEmailConfigured || !this.transporter) {
      this.logger.warn('⚠️  Email not configured. Verification URL logged below:')
      this.logger.warn(`📧 Verification URL: ${verificationUrl}`)
      return { success: false, error: 'Email service not configured', verificationUrl }
    }

    try {
      this.logger.log(`📧 Sending verification email to: ${email}`)
      const info = await this.transporter.sendMail(mailOptions)
      this.logger.log(`✅ Email sent successfully! Message ID: ${info.messageId}`)
      this.logger.log(`📧 Verification URL: ${verificationUrl}`)
      return { success: true, messageId: info.messageId }
    } catch (error) {
      this.logger.error(`❌ Error sending email to ${email}:`, error.message)
      this.logger.error(`📧 Full error:`, error)
      
      // In development, always log the verification URL
      if (process.env.NODE_ENV === 'development') {
        this.logger.warn(`⚠️  Email sending failed. Verification URL: ${verificationUrl}`)
        return { success: false, error: error.message, verificationUrl }
      }
      
      // In production, throw error
      throw error
    }
  }

  async sendPasswordResetEmail(email: string, name: string, token: string) {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000'
    const resetUrl = `${frontendUrl}/reset-password?token=${token}`

    const mailOptions = {
      from: `"Security App" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Reset Your Password - Security App',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset Password</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #10b981 0%, #3b82f6 100%); padding: 30px; border-radius: 12px; text-align: center; margin-bottom: 30px;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Security App</h1>
          </div>
          
          <div style="background: #ffffff; padding: 30px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <h2 style="color: #1f2937; margin-top: 0;">Password Reset Request</h2>
            
            <p style="color: #4b5563; font-size: 16px;">
              Hello ${name},
            </p>
            
            <p style="color: #4b5563; font-size: 16px;">
              We received a request to reset your password. Click the button below to create a new password:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" 
                 style="display: inline-block; background: #10b981; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                Reset Password
              </a>
            </div>
            
            <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
              If you didn't request a password reset, please ignore this email. Your password will remain unchanged.
            </p>
            
            <p style="color: #6b7280; font-size: 14px;">
              This link will expire in 1 hour.
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; color: #9ca3af; font-size: 12px;">
            <p>© ${new Date().getFullYear()} Security App. All rights reserved.</p>
          </div>
        </body>
        </html>
      `,
    }

    try {
      const info = await this.transporter.sendMail(mailOptions)
      return { success: true, messageId: info.messageId }
    } catch (error) {
      console.error('Error sending password reset email:', error)
      if (process.env.NODE_ENV === 'development') {
        console.log('⚠️  Email not configured. Reset URL:', resetUrl)
        return { success: false, error: error.message, resetUrl }
      }
      throw error
    }
  }
}

