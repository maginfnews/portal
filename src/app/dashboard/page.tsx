'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Server, 
  Monitor, 
  HardDrive, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Clock,
  TrendingUp
} from 'lucide-react'

interface DashboardStats {
  servidores: {
    total: number
    online: number
    offline: number
    alerta: number
  }
  estacoes: {
    total: number
    online: number
    offline: number
    alerta: number
  }
  backups: {
    sucesso24h: number
    falha24h: number
    total: number
  }
  alertas: {
    criticos: number
    warnings: number
    total: number
  }
}

interface Alert {
  id: string
  tipo: string
  severidade: string
  mensagem: string
  criadoEm: string
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentAlerts, setRecentAlerts] = useState<Alert[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Simulando dados até implementarmos as APIs
      const mockStats: DashboardStats = {
        servidores: { total: 3, online: 1, offline: 1, alerta: 1 },
        estacoes: { total: 3, online: 2, offline: 0, alerta: 1 },
        backups: { sucesso24h: 2, falha24h: 1, total: 3 },
        alertas: { criticos: 2, warnings: 1, total: 4 }
      }

      const mockAlerts: Alert[] = [
        {
          id: '1',
          tipo: 'MEMORIA_ALTA',
          severidade: 'CRITICAL',
          mensagem: 'Memória do servidor SRV-DB-01 está em 92%',
          criadoEm: new Date().toISOString()
        },
        {
          id: '2',
          tipo: 'SERVIDOR_OFFLINE',
          severidade: 'CRITICAL',
          mensagem: 'Servidor SRV-FILE-01 está offline há 30 minutos',
          criadoEm: new Date(Date.now() - 30 * 60 * 1000).toISOString()
        },
        {
          id: '3',
          tipo: 'CPU_ALTA',
          severidade: 'WARNING',
          mensagem: 'CPU do servidor SRV-DB-01 está em 85%',
          criadoEm: new Date(Date.now() - 60 * 60 * 1000).toISOString()
        }
      ]

      setStats(mockStats)
      setRecentAlerts(mockAlerts)
    } catch (error) {
      console.error('Erro ao buscar dados do dashboard:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getSeverityColor = (severidade: string) => {
    switch (severidade) {
      case 'CRITICAL': return 'text-red-600 bg-red-50'
      case 'WARNING': return 'text-yellow-600 bg-yellow-50'
      default: return 'text-blue-600 bg-blue-50'
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Agora mesmo'
    if (diffInMinutes < 60) return `${diffInMinutes}m atrás`
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours}h atrás`
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}d atrás`
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-maginf-gray mt-2">Visão geral do seu ambiente de TI</p>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Servidores */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Servidores</CardTitle>
            <Server className="h-4 w-4 text-maginf-gray" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.servidores.total}</div>
            <div className="flex items-center space-x-4 text-xs text-maginf-gray mt-2">
              <div className="flex items-center">
                <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                {stats?.servidores.online} Online
              </div>
              <div className="flex items-center">
                <XCircle className="h-3 w-3 text-red-500 mr-1" />
                {stats?.servidores.offline} Offline
              </div>
              <div className="flex items-center">
                <AlertTriangle className="h-3 w-3 text-yellow-500 mr-1" />
                {stats?.servidores.alerta} Alerta
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Estações */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estações</CardTitle>
            <Monitor className="h-4 w-4 text-maginf-gray" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.estacoes.total}</div>
            <div className="flex items-center space-x-4 text-xs text-maginf-gray mt-2">
              <div className="flex items-center">
                <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                {stats?.estacoes.online} Online
              </div>
              <div className="flex items-center">
                <XCircle className="h-3 w-3 text-red-500 mr-1" />
                {stats?.estacoes.offline} Offline
              </div>
              <div className="flex items-center">
                <AlertTriangle className="h-3 w-3 text-yellow-500 mr-1" />
                {stats?.estacoes.alerta} Alerta
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Backups */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Backups 24h</CardTitle>
            <HardDrive className="h-4 w-4 text-maginf-gray" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.backups.total}</div>
            <div className="flex items-center space-x-4 text-xs text-maginf-gray mt-2">
              <div className="flex items-center">
                <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                {stats?.backups.sucesso24h} Sucesso
              </div>
              <div className="flex items-center">
                <XCircle className="h-3 w-3 text-red-500 mr-1" />
                {stats?.backups.falha24h} Falha
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Alertas */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertas Abertos</CardTitle>
            <AlertTriangle className="h-4 w-4 text-maginf-gray" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.alertas.total}</div>
            <div className="flex items-center space-x-4 text-xs text-maginf-gray mt-2">
              <div className="flex items-center">
                <div className="h-3 w-3 bg-red-500 rounded-full mr-1" />
                {stats?.alertas.criticos} Críticos
              </div>
              <div className="flex items-center">
                <div className="h-3 w-3 bg-yellow-500 rounded-full mr-1" />
                {stats?.alertas.warnings} Warnings
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alertas Recentes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-maginf-orange" />
              <span>Alertas Recentes</span>
            </CardTitle>
            <CardDescription>
              Últimos alertas do seu ambiente
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentAlerts.map((alert) => (
                <div key={alert.id} className="flex items-start space-x-3 p-3 rounded-lg border">
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(alert.severidade)}`}>
                    {alert.severidade}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {alert.mensagem}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Clock className="h-3 w-3 text-maginf-gray" />
                      <span className="text-xs text-maginf-gray">
                        {formatTimeAgo(alert.criadoEm)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Gráfico de Performance (placeholder) */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-maginf-orange" />
              <span>Performance Geral</span>
            </CardTitle>
            <CardDescription>
              Visão geral da saúde do ambiente
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Disponibilidade</span>
                  <span className="font-medium">87%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '87%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Performance</span>
                  <span className="font-medium">72%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '72%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Backup Success</span>
                  <span className="font-medium">67%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-red-500 h-2 rounded-full" style={{ width: '67%' }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
