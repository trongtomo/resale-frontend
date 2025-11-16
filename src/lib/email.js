import nodemailer from 'nodemailer'
import { formatCurrency } from '@/utils/format'

/**
 * Email Notification Service
 * 
 * Setup Instructions:
 * 1. For Gmail:
 *    - Enable 2-Step Verification on your Google account
 *    - Generate an App Password: https://myaccount.google.com/apppasswords
 *    - Add to .env.local:
 *      SMTP_HOST=smtp.gmail.com
 *      SMTP_PORT=587
 *      SMTP_USER=your-email@gmail.com
 *      SMTP_PASS=your-app-password
 *      NOTIFICATION_EMAIL=your-email@gmail.com
 * 
 * 2. For other email providers, adjust SMTP settings accordingly
 */

let transporter = null

function getTransporter() {
  if (transporter) return transporter

  // Read configuration from environment variables
  const host = process.env.SMTP_HOST
  const port = parseInt(process.env.SMTP_PORT || '587')
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS

  // If email is not configured, return null (notifications will be skipped)
  if (!host || !user || !pass) {
    console.log('Email not configured. Add SMTP settings to .env.local file. Order notifications will be skipped.')
    return null
  }

  // Create nodemailer transporter with environment variables
  transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // true for 465, false for other ports
    auth: {
      user,
      pass,
    },
  })

  return transporter
}

export async function sendOrderNotification(orderData) {
  // Read notification email from environment variables
  // Falls back to SMTP_USER if NOTIFICATION_EMAIL is not set
  const notificationEmail = process.env.NOTIFICATION_EMAIL || process.env.SMTP_USER

  if (!notificationEmail) {
    console.log('NOTIFICATION_EMAIL not set in .env.local. Skipping email notification.')
    return false
  }

  const emailTransporter = getTransporter()
  if (!emailTransporter) {
    return false
  }

  try {
    const itemsList = orderData.items
      .map(item => `  • ${item.name} x${item.quantity} - ${formatCurrency(item.price * item.quantity, 'USD', 'en-US')}`)
      .join('\n')

    const message = {
      from: `"Resale Store" <${process.env.SMTP_USER}>`,
      to: notificationEmail,
      subject: `🛒 New Order Received - ${orderData.orderId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">🛒 New Order Received!</h2>
          
          <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Order ID:</strong> ${orderData.orderId}</p>
            <p><strong>Date:</strong> ${new Date(orderData.createdAt).toLocaleString()}</p>
          </div>

          <h3 style="color: #1f2937; margin-top: 30px;">👤 Customer Information</h3>
          <div style="background: #f9fafb; padding: 15px; border-radius: 8px; margin: 10px 0;">
            <p><strong>Name:</strong> ${orderData.customer.fullName}</p>
            <p><strong>Email:</strong> ${orderData.customer.email}</p>
            <p><strong>Phone:</strong> ${orderData.customer.phone}</p>
          </div>

          <h3 style="color: #1f2937; margin-top: 30px;">📍 Shipping Address</h3>
          <div style="background: #f9fafb; padding: 15px; border-radius: 8px; margin: 10px 0;">
            <p>${orderData.customer.address}</p>
            <p>${orderData.customer.city} ${orderData.customer.zipCode}</p>
            <p>${orderData.customer.country}</p>
          </div>

          ${orderData.note ? `
          <h3 style="color: #1f2937; margin-top: 30px;">📝 Order Note</h3>
          <div style="background: #f9fafb; padding: 15px; border-radius: 8px; margin: 10px 0;">
            <p style="white-space: pre-wrap;">${orderData.note}</p>
          </div>
          ` : ''}

          <h3 style="color: #1f2937; margin-top: 30px;">🛍️ Order Items</h3>
          <div style="background: #f9fafb; padding: 15px; border-radius: 8px; margin: 10px 0;">
            <pre style="margin: 0; font-family: Arial, sans-serif;">${itemsList}</pre>
          </div>

          <div style="background: #dbeafe; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center;">
            <p style="margin: 0; font-size: 18px; font-weight: bold; color: #1e40af;">
              Total: ${formatCurrency(orderData.total, 'USD', 'en-US')}
            </p>
          </div>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center;">
            <p style="color: #6b7280; font-size: 14px;">
              Check the admin panel for full order details and to manage this order.
            </p>
          </div>
        </div>
      `,
      text: `
New Order Received!

Order ID: ${orderData.orderId}
Date: ${new Date(orderData.createdAt).toLocaleString()}

Customer Information:
Name: ${orderData.customer.fullName}
Email: ${orderData.customer.email}
Phone: ${orderData.customer.phone}

Shipping Address:
${orderData.customer.address}
${orderData.customer.city} ${orderData.customer.zipCode}
${orderData.customer.country}

${orderData.note ? `Order Note:\n${orderData.note}\n\n` : ''}Order Items:
${itemsList}

Total: ${formatCurrency(orderData.total, 'USD', 'en-US')}

Check the admin panel for full order details.
      `.trim(),
    }

    await emailTransporter.sendMail(message)
    console.log('Order notification email sent successfully')
    return true
  } catch (error) {
    console.error('Error sending order notification email:', error)
    return false
  }
}

