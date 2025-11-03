'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Server, Activity, HardDrive, Cpu, MemoryStick, RefreshCw } from 'lucide-react'

interface ServerData {
  id: string
  nome: string
  ip: string
  status: 'ONLINE' | 'OFFLINE' | 'ALERTA'
  cpu: number
  memoria: number
  disco: number
  uptime: string
  ultimaAtualizacao: string
}

export default function ServidoresPage() {
  const [servers, setServers] = useState<ServerData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchServers()
  }, [])

  const fetchServers = async () => {
    setLoading(true)
    // Simulando dados mock
    setTimeout(() => {
      setServers([
        {
          id: '1',
          nome: 'SRV-WEB-01',
          ip: '192.168.1.10',
          status: 'ONLINE',
          cpu: 45,
          memoria: 78,
          disco: 65,
          uptime: '15 dias, 8h',
          ultimaAtualizacao: '2 min atrás'
        },
        {
          id: '2',
          nome: 'SRV-DB-01',
          ip: '192.168.1.11',
          status: 'ALERTA',
          cpu: 85,
          memoria: 92,
          disco: 45,
          uptime: '8 dias, 12h',
          ultimaAtualizacao: '1 min atrás'
        },
        {
          id: '3',
          nome: 'SRV-FILE-01',
          ip: '192.168.1.12',
          status: 'ONLINE',
          cpu: 25,
          memoria: 55,
          disco: 88,
          uptime: '22 dias, 4h',
          ultimaAtualizacao: '3 min atrás'
        },
        {
          id: '4',
          nome: 'SRV-BACKUP-01',
          ip: '192.168.1.13',
          status: 'OFFLINE',
          cpu: 0,
          memoria: 0,
          disco: 0,
          uptime: 'Offline',
          ultimaAtualizacao: '2h atrás'
        }
      ])
      setLoading(false)
    }, 1000)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ONLINE': return 'bg-green-100 text-green-800'
      case 'OFFLINE': return 'bg-red-100 text-red-800'
      case 'ALERTA': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getMetricColor = (value: number) => {
    if (value >= 90) return 'text-red-600'
    if (value >= 75) return 'text-yellow-600'
    return 'text-green-600'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-maginf-orange" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Servidores</h1>
          <p className="text-maginf-gray">Monitoramento em tempo real dos servidores</p>
        </div>
        <Button onClick={fetchServers} className="bg-maginf-orange hover:bg-maginf-orange-dark">
          <RefreshCw className="h-4 w-4 mr-2" />
          Atualizar
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {servers.map((server) => (
          <Card key={server.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Server className="h-5 w-5 text-maginf-orange" />
                  <CardTitle className="text-lg">{server.nome}</CardTitle>
                </div>
                <Badge className={getStatusColor(server.status)}>
                  {server.status}
                </Badge>
              </div>
              <p className="text-sm text-maginf-gray">{server.ip}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Cpu className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">CPU</span>
                  </div>
                  <span className={`text-sm font-medium ${getMetricColor(server.cpu)}`}>
                    {server.cpu}%
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <MemoryStick className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Memória</span>
                  </div>
                  <span className={`text-sm font-medium ${getMetricColor(server.memoria)}`}>
                    {server.memoria}%
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <HardDrive className="h-4 w-4 text-purple-500" />
                    <span className="text-sm">Disco</span>
                  </div>
                  <span className={`text-sm font-medium ${getMetricColor(server.disco)}`}>
                    {server.disco}%
                  </span>
                </div>
              </div>
              
              <div className="pt-3 border-t border-gray-200">
                <div className="flex items-center justify-between text-xs text-maginf-gray">
                  <span>Uptime: {server.uptime}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-maginf-gray mt-1">
                  <span>Atualizado: {server.ultimaAtualizacao}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
