# Cloudinary Setup

## Installation

Run the following command to install Cloudinary:

```bash
npm install cloudinary
```

## Environment Variables

Create a `.env.local` file in the root directory with your Cloudinary credentials:

```env
CLOUDINARY_CLOUD_NAME=ddez0qflc
CLOUDINARY_API_KEY=533122228674959
CLOUDINARY_API_SECRET=EQUISOv6sNmHLk9jZ3HCeTmU354
```

**Note:** For production (Vercel), add these environment variables in your Vercel project settings:
1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Add the three Cloudinary variables above

## Features

- ✅ Automatic image optimization (quality: auto, format: auto)
- ✅ Images stored in Cloudinary cloud storage
- ✅ Images organized in folders (default: `resale-products`)
- ✅ Secure HTTPS URLs
- ✅ Image deletion support

## Usage

The upload API route (`/api/upload`) now automatically uploads images to Cloudinary and returns:
- `url`: The secure HTTPS URL of the uploaded image
- `public_id`: The Cloudinary public ID (for deletion if needed)
- `width` and `height`: Image dimensions

## Image URLs

All uploaded images will have URLs like:
```
https://res.cloudinary.com/ddez0qflc/image/upload/v1234567890/resale-products/filename.jpg
```

These URLs are automatically optimized by Cloudinary for best performance.

