'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AlertTriangle, Info, AlertCircle, RefreshCw } from 'lucide-react'

interface AlertaData {
  id: string
  tipo: string
  severidade: 'INFO' | 'WARNING' | 'CRITICAL'
  mensagem: string
  origem: string
  dataHora: string
  resolvido: boolean
}

export default function AlertasPage() {
  const [alertas, setAlertas] = useState<AlertaData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAlertas()
  }, [])

  const fetchAlertas = async () => {
    setLoading(true)
    setTimeout(() => {
      setAlertas([
        {
          id: '1',
          tipo: 'CPU_ALTA',
          severidade: 'WARNING',
          mensagem: 'CPU do servidor SRV-DB-01 está em 85%',
          origem: 'SRV-DB-01',
          dataHora: '10:45 - Hoje',
          resolvido: false
        },
        {
          id: '2',
          tipo: 'MEMORIA_ALTA',
          severidade: 'CRITICAL',
          mensagem: 'Memória do servidor SRV-DB-01 está em 92%',
          origem: 'SRV-DB-01',
          dataHora: '10:30 - Hoje',
          resolvido: false
        },
        {
          id: '3',
          tipo: 'BACKUP_FALHO',
          severidade: 'CRITICAL',
          mensagem: 'Falha no backup de documentos - Erro de conexão',
          origem: 'SRV-FILE-01',
          dataHora: '03:00 - Hoje',
          resolvido: false
        },
        {
          id: '4',
          tipo: 'SERVIDOR_OFFLINE',
          severidade: 'CRITICAL',
          mensagem: 'Servidor SRV-BACKUP-01 está offline',
          origem: 'SRV-BACKUP-01',
          dataHora: '08:15 - Hoje',
          resolvido: false
        },
        {
          id: '5',
          tipo: 'DISCO_CHEIO',
          severidade: 'WARNING',
          mensagem: 'Disco do servidor SRV-FILE-01 está 88% cheio',
          origem: 'SRV-FILE-01',
          dataHora: '09:20 - Hoje',
          resolvido: true
        }
      ])
      setLoading(false)
    }, 700)
  }

  const getSeveridadeColor = (severidade: string) => {
    switch (severidade) {
      case 'INFO': return 'bg-blue-100 text-blue-800'
      case 'WARNING': return 'bg-yellow-100 text-yellow-800'
      case 'CRITICAL': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getSeveridadeIcon = (severidade: string) => {
    switch (severidade) {
      case 'INFO': return <Info className="h-4 w-4" />
      case 'WARNING': return <AlertTriangle className="h-4 w-4" />
      case 'CRITICAL': return <AlertCircle className="h-4 w-4" />
      default: return <Info className="h-4 w-4" />
    }
  }

  const alertasAtivos = alertas.filter(a => !a.resolvido)
  const alertasResolvidos = alertas.filter(a => a.resolvido)

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
          <h1 className="text-2xl font-bold text-gray-900">Alertas</h1>
          <p className="text-maginf-gray">Monitoramento de alertas do sistema</p>
        </div>
        <Button onClick={fetchAlertas} className="bg-maginf-orange hover:bg-maginf-orange-dark">
          <RefreshCw className="h-4 w-4 mr-2" />
          Atualizar
        </Button>
      </div>

      {/* Alertas Ativos */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Alertas Ativos ({alertasAtivos.length})
        </h2>
        <div className="space-y-4">
          {alertasAtivos.map((alerta) => (
            <Card key={alerta.id} className="border-l-4 border-l-red-500">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      {getSeveridadeIcon(alerta.severidade)}
                      <Badge className={getSeveridadeColor(alerta.severidade)}>
                        {alerta.severidade}
                      </Badge>
                      <span className="text-sm text-maginf-gray">{alerta.tipo}</span>
                    </div>
                    <p className="font-medium text-gray-900 mb-1">{alerta.mensagem}</p>
                    <div className="flex items-center space-x-4 text-sm text-maginf-gray">
                      <span>Origem: {alerta.origem}</span>
                      <span>{alerta.dataHora}</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Resolver
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Alertas Resolvidos */}
      {alertasResolvidos.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Alertas Resolvidos ({alertasResolvidos.length})
          </h2>
          <div className="space-y-4">
            {alertasResolvidos.map((alerta) => (
              <Card key={alerta.id} className="border-l-4 border-l-green-500 opacity-75">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        {getSeveridadeIcon(alerta.severidade)}
                        <Badge className="bg-green-100 text-green-800">
                          RESOLVIDO
                        </Badge>
                        <span className="text-sm text-maginf-gray">{alerta.tipo}</span>
                      </div>
                      <p className="font-medium text-gray-900 mb-1">{alerta.mensagem}</p>
                      <div className="flex items-center space-x-4 text-sm text-maginf-gray">
                        <span>Origem: {alerta.origem}</span>
                        <span>{alerta.dataHora}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
