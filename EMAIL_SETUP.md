# Email Notification Setup

This guide will help you configure email notifications for new orders.

## Setup Instructions

### For Gmail (Recommended)

1. **Enable 2-Step Verification**
   - Go to your Google Account: https://myaccount.google.com/
   - Navigate to Security → 2-Step Verification
   - Enable it if not already enabled

2. **Generate App Password**
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Enter "Resale Store" as the name
   - Click "Generate"
   - Copy the 16-character password (you'll need this)

3. **Add to Environment Variables**
   - Create or edit `.env.local` in your project root
   - Add the following:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-character-app-password
NOTIFICATION_EMAIL=your-email@gmail.com
```

**Important:** 
- `SMTP_USER` = Your Gmail address
- `SMTP_PASS` = The 16-character app password (not your regular Gmail password)
- `NOTIFICATION_EMAIL` = Where you want to receive order notifications (can be same as SMTP_USER or different)

### For Other Email Providers

#### Outlook/Hotmail
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=your-email@outlook.com
SMTP_PASS=your-password
NOTIFICATION_EMAIL=your-email@outlook.com
```

#### Yahoo Mail
```env
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
SMTP_USER=your-email@yahoo.com
SMTP_PASS=your-app-password
NOTIFICATION_EMAIL=your-email@yahoo.com
```

#### Custom SMTP Server
```env
SMTP_HOST=your-smtp-server.com
SMTP_PORT=587
SMTP_USER=your-username
SMTP_PASS=your-password
NOTIFICATION_EMAIL=your-notification-email@example.com
```

## Testing

1. Place a test order through the checkout page
2. Check your email inbox (and spam folder) for the notification
3. Check the admin panel at `/admin/orders` to see the order

## Troubleshooting

### Email not sending?
- Check that all environment variables are set correctly
- Verify your SMTP credentials are correct
- Check your spam folder
- For Gmail, make sure you're using an App Password, not your regular password
- Check server logs for error messages

### Order saved but no email?
- The order is still saved to `src/data/orders.json`
- You can view it in the admin panel at `/admin/orders`
- Email notifications are optional - orders work without them

## Notes

- Orders are **always saved** to the database, even if email fails
- Email notifications are sent asynchronously (won't block order processing)
- If email is not configured, orders will still work normally
- You can view all orders in the admin panel regardless of email status

