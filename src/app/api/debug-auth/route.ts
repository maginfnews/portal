import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    console.log('[DEBUG-AUTH] Iniciando debug de autenticação...')
    
    // 1. Verificar variáveis de ambiente
    const envCheck = {
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
      NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
      GOOGLE_CLIENT_ID: !!process.env.GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET: !!process.env.GOOGLE_CLIENT_SECRET,
      NODE_ENV: process.env.NODE_ENV
    }
    
    console.log('[DEBUG-AUTH] Environment variables:', envCheck)
    
    // 2. Verificar sessão atual
    const session = await getServerSession()
    console.log('[DEBUG-AUTH] Current session:', session ? 'exists' : 'null')
    
    // 3. Listar usuários no banco
    const users = await prisma.user.findMany({
      select: {
        id: true,
        nome: true,
        email: true,
        role: true,
        senhaHash: true,
        ativo: true
      }
    })
    
    console.log('[DEBUG-AUTH] Users in database:', users.length)
    
    // 4. Verificar últimos logs de autenticação
    const response = {
      timestamp: new Date().toISOString(),
      environment: envCheck,
      session: session,
      database: {
        userCount: users.length,
        users: users.map(u => ({
          email: u.email,
          nome: u.nome,
          role: u.role,
          hasPassword: !!u.senhaHash,
          active: u.ativo
        }))
      },
      nextAuthConfig: {
        callbackUrl: `${process.env.NEXTAUTH_URL}/api/auth/callback/google`,
        signInUrl: `${process.env.NEXTAUTH_URL}/api/auth/signin`,
        baseUrl: process.env.NEXTAUTH_URL
      }
    }
    
    return NextResponse.json(response)
    
  } catch (error) {
    console.error('[DEBUG-AUTH] Erro:', error)
    
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
