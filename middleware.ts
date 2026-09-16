import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { getDashboardRoute } from '@/lib/permissions/routes';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  if (!supabaseUrl || !supabaseAnonKey) {
    return response;
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return request.cookies.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        request.cookies.set({ name, value, ...options });
        response = NextResponse.next({
          request: {
            headers: request.headers,
          },
        });
        response.cookies.set({ name, value, ...options });
      },
      remove(name: string, options: CookieOptions) {
        request.cookies.set({ name, value: '', ...options });
        response = NextResponse.next({
          request: {
            headers: request.headers,
          },
        });
        response.cookies.set({ name, value: '', ...options });
      },
    },
  });

  const { data: { user } } = await supabase.auth.getUser();
  const demoSessionCookie = request.cookies.get('ayush_demo_session')?.value;
  const isAuthenticated = !!user || !!demoSessionCookie;

  const pathname = request.nextUrl.pathname;
  const isProtectedPath =
    pathname.startsWith('/student') ||
    pathname.startsWith('/industry') ||
    pathname.startsWith('/institution') ||
    pathname.startsWith('/faculty') ||
    pathname.startsWith('/admin');

  const isPublicAuthPath =
    pathname === '/login' ||
    pathname === '/register' ||
    pathname === '/forgot-password';

  // 1. If user is NOT authenticated and trying to access protected dashboards -> Redirect to /login
  if (!isAuthenticated && isProtectedPath) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. If user IS authenticated and visiting public auth pages -> Redirect to their role dashboard
  if (isAuthenticated && isPublicAuthPath) {
    const role = (user?.user_metadata?.role as any) || (demoSessionCookie as any) || 'STUDENT';
    const targetDashboard = getDashboardRoute(role);
    return NextResponse.redirect(new URL(targetDashboard, request.url));
  }

  return response;
}

export const config = {
  matcher: [
    '/',
    '/login',
    '/register',
    '/forgot-password',
    '/student/:path*',
    '/industry/:path*',
    '/institution/:path*',
    '/faculty/:path*',
    '/admin/:path*',
  ],
};
