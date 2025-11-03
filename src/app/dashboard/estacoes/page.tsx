'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Monitor, User, RefreshCw } from 'lucide-react'

interface EstacaoData {
  id: string
  nome: string
  usuario: string
  ip: string
  status: 'ONLINE' | 'OFFLINE' | 'ALERTA'
  ultimoLogin: string
  sistemaOperacional: string
}

export default function EstacoesPage() {
  const [estacoes, setEstacoes] = useState<EstacaoData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEstacoes()
  }, [])

  const fetchEstacoes = async () => {
    setLoading(true)
    setTimeout(() => {
      setEstacoes([
        {
          id: '1',
          nome: 'EST-ADM-01',
          usuario: 'João Silva',
          ip: '192.168.1.100',
          status: 'ONLINE',
          ultimoLogin: '08:30 - Hoje',
          sistemaOperacional: 'Windows 11 Pro'
        },
        {
          id: '2',
          nome: 'EST-DEV-01',
          usuario: 'Maria Santos',
          ip: '192.168.1.101',
          status: 'ONLINE',
          ultimoLogin: '09:15 - Hoje',
          sistemaOperacional: 'Windows 10 Pro'
        },
        {
          id: '3',
          nome: 'EST-FIN-01',
          usuario: 'Carlos Oliveira',
          ip: '192.168.1.102',
          status: 'OFFLINE',
          ultimoLogin: '17:45 - Ontem',
          sistemaOperacional: 'Windows 11 Pro'
        }
      ])
      setLoading(false)
    }, 800)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ONLINE': return 'bg-green-100 text-green-800'
      case 'OFFLINE': return 'bg-red-100 text-red-800'
      case 'ALERTA': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
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
          <h1 className="text-2xl font-bold text-gray-900">Estações de Trabalho</h1>
          <p className="text-maginf-gray">Monitoramento das estações de trabalho</p>
        </div>
        <Button onClick={fetchEstacoes} className="bg-maginf-orange hover:bg-maginf-orange-dark">
          <RefreshCw className="h-4 w-4 mr-2" />
          Atualizar
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {estacoes.map((estacao) => (
          <Card key={estacao.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Monitor className="h-5 w-5 text-maginf-orange" />
                  <CardTitle className="text-lg">{estacao.nome}</CardTitle>
                </div>
                <Badge className={getStatusColor(estacao.status)}>
                  {estacao.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">{estacao.usuario}</span>
              </div>
              
              <div className="space-y-2 text-sm text-maginf-gray">
                <p><strong>IP:</strong> {estacao.ip}</p>
                <p><strong>SO:</strong> {estacao.sistemaOperacional}</p>
                <p><strong>Último Login:</strong> {estacao.ultimoLogin}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
