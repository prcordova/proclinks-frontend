import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Verifica se é uma rota protegida
  if (request.nextUrl.pathname.startsWith('/profile/edit')) {
    // No mundo real, isso seria uma verificação de token JWT
    const isAuthenticated = request.cookies.get('auth')
    
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/profile/:path*',
} 