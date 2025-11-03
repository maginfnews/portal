import { NextRequest, NextResponse } from 'next/server'
import { authenticateUser, generateToken } from '@/lib/auth'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha é obrigatória'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('[LOGIN API] Body recebido:', body)
    
    const { email, password } = loginSchema.parse(body)
    console.log('[LOGIN API] Dados validados:', { email, password: '***' })

    const user = await authenticateUser(email, password)
    console.log('[LOGIN API] Usuário encontrado:', !!user)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Credenciais inválidas' },
        { status: 401 }
      )
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      tenantId: user.tenantId,
      nome: user.nome,
    })

    const response = NextResponse.json({
      data: {
        user: {
          id: user.id,
          nome: user.nome,
          email: user.email,
          role: user.role,
          tenant: user.tenant,
        },
        token,
      },
    })

    // Definir cookie httpOnly para o token
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: false, // Forçar false para desenvolvimento local
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // 24 horas
      domain: 'localhost', // Especificar domínio para localhost
    })
    
    console.log('[LOGIN API] Cookie definido com sucesso:', {
      token: token.substring(0, 20) + '...',
      domain: 'localhost',
      path: '/',
      secure: false
    })

    return response
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Erro no login:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
