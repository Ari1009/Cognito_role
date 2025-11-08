import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter | null = null;

  constructor(private configService: ConfigService) {}

  private async getTransporter(): Promise<nodemailer.Transporter> {
    if (this.transporter) return this.transporter;

    const host = this.configService.get<string>('EMAIL_HOST');
    const port = this.configService.get<number>('EMAIL_PORT' as any);
    const secure = this.configService.get<string>('EMAIL_SECURE') === 'true';
    const user = this.configService.get<string>('EMAIL_USER');
    const pass = this.configService.get<string>('EMAIL_PASSWORD');

    if (host && user && pass) {
      this.transporter = nodemailer.createTransport({
        host,
        port: port as any,
        secure,
        auth: { user, pass },
      });
      return this.transporter;
    }

    const testAccount = await nodemailer.createTestAccount();
    this.transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: { user: testAccount.user, pass: testAccount.pass },
    });
    return this.transporter;
  }

  async sendOtpEmail(email: string, otp: string): Promise<void> {
    const mailOptions = {
      from: this.configService.get('EMAIL_USER') || 'no-reply@foodzy.dev',
      to: email,
      subject: 'Your OTP for Foodzy E-commerce',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #FF6B6B;">Foodzy E-commerce</h2>
          <p>Your OTP for verification is:</p>
          <h1 style="color: #FF6B6B; font-size: 32px; letter-spacing: 5px;">${otp}</h1>
          <p>This OTP will expire in 10 minutes.</p>
          <p>If you didn't request this OTP, please ignore this email.</p>
        </div>
      `,
    };

    try {
      const transporter = await this.getTransporter();
      const info = await transporter.sendMail(mailOptions);
      const url = nodemailer.getTestMessageUrl(info);
      if (url) console.log(`Preview URL: ${url}`);
      console.log(`OTP email sent to ${email}`);
    } catch (error) {
      console.error('Error sending OTP email:', error);
      throw new Error('Failed to send OTP email');
    }
  }

  async sendOrderConfirmation(
    email: string,
    orderDetails: any,
  ): Promise<void> {
    const mailOptions = {
      from: this.configService.get('EMAIL_USER') || 'no-reply@foodzy.dev',
      to: email,
      subject: 'Order Confirmation - Foodzy E-commerce',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #FF6B6B;">Order Confirmation</h2>
          <p>Thank you for your order!</p>
          <h3>Order Details:</h3>
          <p><strong>Order ID:</strong> ${orderDetails.id}</p>
          <p><strong>Total Amount:</strong> $${orderDetails.totalAmount}</p>
          <h4>Items:</h4>
          <ul>
            ${orderDetails.items
              .map(
                (item: any) => `
              <li>${item.productName} - Quantity: ${item.quantity} - $${item.total}</li>
            `,
              )
              .join('')}
          </ul>
          <h4>Shipping Address:</h4>
          <p>
            ${orderDetails.firstName} ${orderDetails.lastName}<br/>
            ${orderDetails.address}<br/>
            ${orderDetails.city}, ${orderDetails.regionState} ${orderDetails.postCode}<br/>
            ${orderDetails.country}
          </p>
          <p>We'll send you another email when your order ships.</p>
          <p style="margin-top: 30px;">Thank you for shopping with Foodzy!</p>
        </div>
      `,
    };

    try {
      const transporter = await this.getTransporter();
      const info = await transporter.sendMail(mailOptions);
      const url = nodemailer.getTestMessageUrl(info);
      if (url) console.log(`Preview URL: ${url}`);
      console.log(`Order confirmation email sent to ${email}`);
    } catch (error) {
      console.error('Error sending order confirmation email:', error);
    }
  }
}
