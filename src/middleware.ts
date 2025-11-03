import { withAuth } from 'next-auth/middleware'

export default withAuth(
  function middleware(req) {
    console.log(`[MIDDLEWARE] Usuário autenticado acessando: ${req.nextUrl.pathname}`)
    console.log(`[MIDDLEWARE] Token:`, req.nextauth.token?.email)
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl
        console.log(`[MIDDLEWARE AUTH] Verificando: ${pathname}`)
        console.log(`[MIDDLEWARE AUTH] Token presente: ${!!token}`)
        
        // Rotas públicas
        const publicRoutes = ['/', '/login', '/login-nextauth', '/debug', '/test-db', '/status', '/test-login', '/test-session']
        if (publicRoutes.includes(pathname)) {
          console.log(`[MIDDLEWARE AUTH] Rota pública permitida: ${pathname}`)
          return true
        }

        // Rotas da API (todas públicas por enquanto)
        if (pathname.startsWith('/api/')) {
          console.log(`[MIDDLEWARE AUTH] API route permitida: ${pathname}`)
          return true
        }

        // Outras rotas precisam de autenticação
        const authorized = !!token
        console.log(`[MIDDLEWARE AUTH] Autorizado: ${authorized}`)
        return authorized
      },
    },
    pages: {
      signIn: '/login',
    },
  }
)

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
