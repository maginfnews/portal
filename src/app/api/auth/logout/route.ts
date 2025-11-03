import { NextResponse } from 'next/server'

export async function POST() {
  const response = NextResponse.json({ data: { message: 'Logout realizado com sucesso' } })
  
  // Remover o cookie de autenticação
  response.cookies.set('auth-token', '', {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    path: '/',
    domain: 'localhost',
    maxAge: 0,
  })
  
  console.log('[LOGOUT API] Cookie removido com sucesso')

  return response
}
