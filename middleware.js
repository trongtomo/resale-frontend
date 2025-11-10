import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function middleware(request) {
  const { pathname } = request.nextUrl

  // Protect admin routes
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const cookieStore = await cookies()
    const session = cookieStore.get('admin_session')

    if (!session || session.value !== 'authenticated') {
      // Redirect to login if not authenticated
      return NextResponse.redirect(new URL('/admin/login', request.url))
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
      const cookieStore = await cookies()
      const session = cookieStore.get('admin_session')

      if (!session || session.value !== 'authenticated') {
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
    '/admin/:path*',
    '/api/products/:path*',
    '/api/articles/:path*',
    '/api/upload/:path*',
    '/api/categories/:path*',
    '/api/brands/:path*',
  ],
}

