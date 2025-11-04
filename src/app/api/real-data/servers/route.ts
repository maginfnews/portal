import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { IntegrationManager } from '@/lib/integrations/manager'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.tenantId) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const manager = new IntegrationManager()
    
    // Tentar buscar dados de diferentes fontes
    const results: {
      servers: any[]
      alerts: any[]
      source: string
    } = {
      servers: [],
      alerts: [],
      source: 'mock' // padrão
    }

    try {
      // Tentar Zabbix primeiro
      const zabbixData = await manager.getZabbixData(session.user.tenantId)
      results.servers = zabbixData.servers
      results.alerts = zabbixData.alerts
      results.source = 'zabbix'
    } catch (zabbixError) {
      console.log('[REAL-DATA] Zabbix não disponível:', zabbixError)
      
      try {
        // Tentar PRTG como fallback
        const prtgData = await manager.getPRTGData(session.user.tenantId)
        results.servers = prtgData.servers
        results.alerts = prtgData.alerts
        results.source = 'prtg'
      } catch (prtgError) {
        console.log('[REAL-DATA] PRTG não disponível:', prtgError)
        
        // Usar dados mock como último recurso
        results.servers = [
          {
            id: 'mock-1',
            nome: 'Servidor Principal (Mock)',
            ip: '192.168.1.10',
            status: 'online',
            tipo: 'servidor',
            ultimaAtualizacao: new Date().toISOString(),
            note: 'Configure integrações para dados reais'
          },
          {
            id: 'mock-2',
            nome: 'Servidor Backup (Mock)',
            ip: '192.168.1.11',
            status: 'offline',
            tipo: 'servidor',
            ultimaAtualizacao: new Date().toISOString(),
            note: 'Configure integrações para dados reais'
          }
        ]
        
        results.alerts = [
          {
            id: 'mock-alert-1',
            tipo: 'warning',
            titulo: 'Dados Mock Ativos',
            descricao: 'Configure integrações (Zabbix, PRTG, etc.) para obter dados reais',
            timestamp: new Date().toISOString(),
            resolvido: false
          }
        ]
      }
    }

    return NextResponse.json({
      success: true,
      data: results,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('[REAL-DATA] Erro:', error)
    
    return NextResponse.json({
      error: 'Erro interno do servidor',
      message: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
}
