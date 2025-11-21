import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
export function proxy(request: NextRequest) {
  // Protect API and dashboard routes
  if (
    request.nextUrl.pathname.startsWith('/api') ||
    request.nextUrl.pathname.startsWith('/dashboard')
  ) {
    const token = request.cookies.get('auth_token')?.value;

    if (!token) {
      // Redirect to login if no token
      return NextResponse.redirect(new URL('/signin', request.url));
    }

    try {
      // Verify JWT
      const decoded = jwt.verify(token, process.env.JWT_SECRET!);

      // Attach user info to request headers
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('X-User-Id', (decoded as any).userId);

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    } catch (error) {
      // Invalid token → clear cookie and redirect
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('auth_token');
      return response;
    }
  }

  // Allow other routes
  return NextResponse.next();
}

export const config = {
  matcher: ['/api/issue/:path*', '/dashboard/:path*'],
};
