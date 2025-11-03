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

    // Para admin da Maginf, pode escolher um tenant específico ou ver todos
    const whereClause = userRole === 'MAGINF_ADMIN' && !tenantId 
      ? {} 
      : { tenantId: tenantId || undefined }

    // Buscar estatísticas
    const [servidores, estacoes, backupJobs, alertas] = await Promise.all([
      prisma.server.groupBy({
        by: ['status'],
        where: whereClause,
        _count: true,
      }),
      prisma.workstation.groupBy({
        by: ['status'],
        where: whereClause,
        _count: true,
      }),
      prisma.backupJob.groupBy({
        by: ['ultimaExecucaoStatus'],
        where: {
          ...whereClause,
          ultimaExecucaoEm: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // últimas 24h
          },
        },
        _count: true,
      }),
      prisma.alert.groupBy({
        by: ['severidade'],
        where: {
          ...whereClause,
          resolvido: false,
        },
        _count: true,
      }),
    ])

    // Processar dados dos servidores
    const servidoresStats = {
      total: servidores.reduce((acc, curr) => acc + curr._count, 0),
      online: servidores.find(s => s.status === 'ONLINE')?._count || 0,
      offline: servidores.find(s => s.status === 'OFFLINE')?._count || 0,
      alerta: servidores.find(s => s.status === 'ALERTA')?._count || 0,
    }

    // Processar dados das estações
    const estacoesStats = {
      total: estacoes.reduce((acc, curr) => acc + curr._count, 0),
      online: estacoes.find(e => e.status === 'ONLINE')?._count || 0,
      offline: estacoes.find(e => e.status === 'OFFLINE')?._count || 0,
      alerta: estacoes.find(e => e.status === 'ALERTA')?._count || 0,
    }

    // Processar dados dos backups
    const backupsStats = {
      total: backupJobs.reduce((acc, curr) => acc + curr._count, 0),
      sucesso24h: backupJobs.find(b => b.ultimaExecucaoStatus === 'SUCESSO')?._count || 0,
      falha24h: backupJobs.find(b => b.ultimaExecucaoStatus === 'FALHA')?._count || 0,
    }

    // Processar dados dos alertas
    const alertasStats = {
      total: alertas.reduce((acc, curr) => acc + curr._count, 0),
      criticos: alertas.find(a => a.severidade === 'CRITICAL')?._count || 0,
      warnings: alertas.find(a => a.severidade === 'WARNING')?._count || 0,
    }

    return NextResponse.json({
      data: {
        servidores: servidoresStats,
        estacoes: estacoesStats,
        backups: backupsStats,
        alertas: alertasStats,
      },
    })
  } catch (error) {
    console.error('Erro ao buscar overview:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
