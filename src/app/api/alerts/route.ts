import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const tenantId = request.headers.get('x-tenant-id')
    const userRole = request.headers.get('x-user-role')

    if (!tenantId && userRole !== 'MAGINF_ADMIN') {
      return NextResponse.json(
        { error: 'Acesso negado' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status') // 'aberto' ou 'resolvido'
    const severidade = searchParams.get('severidade')

    const whereClause: any = {}
    
    if (tenantId || userRole !== 'MAGINF_ADMIN') {
      whereClause.tenantId = tenantId
    }

    if (status === 'aberto') {
      whereClause.resolvido = false
    } else if (status === 'resolvido') {
      whereClause.resolvido = true
    }

    if (severidade) {
      whereClause.severidade = severidade
    }

    const alerts = await prisma.alert.findMany({
      where: whereClause,
      orderBy: {
        criadoEm: 'desc',
      },
      take: limit,
      include: {
        tenant: {
          select: {
            nome: true,
          },
        },
      },
    })

    return NextResponse.json({
      data: alerts,
    })
  } catch (error) {
    console.error('Erro ao buscar alertas:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
