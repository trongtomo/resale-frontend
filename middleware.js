import { NextResponse } from 'next/server'

export function middleware(request) {
  const { pathname } = request.nextUrl
  const adminSession = request.cookies.get('admin_session')

  // Protect admin routes (exclude login page)
  if (pathname === '/admin' || (pathname.startsWith('/admin/') && pathname !== '/admin/login')) {
    if (!adminSession || adminSession.value !== 'authenticated') {
      // Redirect to login if not authenticated
      const url = new URL('/admin/login', request.url)
      return NextResponse.redirect(url)
    }
  }

  // Protect API write routes
  if (
    pathname.startsWith('/api/products') ||
    pathname.startsWith('/api/articles') ||
    pathname.startsWith('/api/upload') ||
    pathname.startsWith('/api/categories') ||
    pathname.startsWith('/api/brands')
  ) {
    const method = request.method

    // Only protect write operations (POST, PUT, DELETE)
    if (['POST', 'PUT', 'DELETE'].includes(method)) {
      if (!adminSession || adminSession.value !== 'authenticated') {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        )
      }
    }
  }

  // Protect orders API - GET, PUT, DELETE require auth, POST is public (for customers)
  if (pathname.startsWith('/api/orders')) {
    const method = request.method

    // Protect GET, PUT, DELETE (admin only)
    if (['GET', 'PUT', 'DELETE'].includes(method)) {
      if (!adminSession || adminSession.value !== 'authenticated') {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        )
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin',
    '/admin/:path*',
    '/api/products/:path*',
    '/api/articles/:path*',
    '/api/upload/:path*',
    '/api/categories/:path*',
    '/api/brands/:path*',
    '/api/orders/:path*',
  ],
}

// Force middleware to run on all admin routes
export const runtime = 'nodejs'

