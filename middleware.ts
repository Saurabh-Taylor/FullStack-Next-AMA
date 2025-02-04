import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
export { default } from "next-auth/middleware"
 
// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {

    const token = await getToken({req:request, secret:process.env.NEXT_AUTH_SECRET })
    console.log(token);
    
    

    /*
        Given a request to /home, pathname is /home
    request.nextUrl.pathname
        Given a request to /home?name=lee, searchParams is { 'name': 'lee' }
    request.nextUrl.searchParams
    */
    const url = request.nextUrl
    if (
        token &&
        (url.pathname.startsWith('/sign-in') ||
          url.pathname.startsWith('/sign-up') ||
          url.pathname.startsWith('/verify') ||
          url.pathname === '/')
      ) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }

      if (!token && url.pathname.startsWith('/dashboard')) {
        return NextResponse.redirect(new URL('/sign-in', request.url));
      }
      
        return NextResponse.next()
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/sign-in',
    '/sign-up',
    '/',
    '/dashboard/:path*',
    '/verify/:path*'
  ],
}

/*
1. console.log("request.nextUrl from middleware", url);
    request.nextUrl from middleware {

    href: 'http://localhost:3000/sign-in',
    origin: 'http://localhost:3000',
    protocol: 'http:',
    username: '',
    password: '',
    host: 'localhost:3000',
    hostname: 'localhost',
    port: '3000',
    pathname: '/sign-in',
    search: '',
    searchParams: URLSearchParams {  },
    hash: ''
    }

2. console.log("request.url from middleware", request.url);
    request.url from middleware http://localhost:3000/sign-in

3. console.log("url.pathname from middleware ", url.pathname);
    url.pathname from middleware  /sign-in

*/