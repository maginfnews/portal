'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { HardDrive, CheckCircle, XCircle, Clock, RefreshCw } from 'lucide-react'

interface BackupData {
  id: string
  nome: string
  origem: string
  destino: string
  status: 'SUCESSO' | 'FALHA' | 'EM_ANDAMENTO'
  ultimaExecucao: string
  proximaExecucao: string
  tamanho: string
  duracao: string
}

export default function BackupsPage() {
  const [backups, setBackups] = useState<BackupData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBackups()
  }, [])

  const fetchBackups = async () => {
    setLoading(true)
    setTimeout(() => {
      setBackups([
        {
          id: '1',
          nome: 'Backup Banco de Dados',
          origem: 'SRV-DB-01',
          destino: 'NAS-BACKUP-01',
          status: 'SUCESSO',
          ultimaExecucao: '02:00 - Hoje',
          proximaExecucao: '02:00 - Amanhã',
          tamanho: '2.5 GB',
          duracao: '15 min'
        },
        {
          id: '2',
          nome: 'Backup Arquivos Sistema',
          origem: 'SRV-WEB-01',
          destino: 'NAS-BACKUP-01',
          status: 'SUCESSO',
          ultimaExecucao: '01:30 - Hoje',
          proximaExecucao: '01:30 - Amanhã',
          tamanho: '850 MB',
          duracao: '8 min'
        },
        {
          id: '3',
          nome: 'Backup Documentos',
          origem: 'SRV-FILE-01',
          destino: 'Cloud Storage',
          status: 'FALHA',
          ultimaExecucao: '03:00 - Hoje',
          proximaExecucao: '03:00 - Amanhã',
          tamanho: '0 MB',
          duracao: 'Falhou'
        },
        {
          id: '4',
          nome: 'Backup Incremental',
          origem: 'Múltiplos Servidores',
          destino: 'NAS-BACKUP-02',
          status: 'EM_ANDAMENTO',
          ultimaExecucao: 'Executando...',
          proximaExecucao: '22:00 - Hoje',
          tamanho: '1.2 GB',
          duracao: '45 min (estimado)'
        }
      ])
      setLoading(false)
    }, 900)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SUCESSO': return 'bg-green-100 text-green-800'
      case 'FALHA': return 'bg-red-100 text-red-800'
      case 'EM_ANDAMENTO': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'SUCESSO': return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'FALHA': return <XCircle className="h-4 w-4 text-red-600" />
      case 'EM_ANDAMENTO': return <Clock className="h-4 w-4 text-blue-600" />
      default: return <Clock className="h-4 w-4 text-gray-600" />
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
          <h1 className="text-2xl font-bold text-gray-900">Backups</h1>
          <p className="text-maginf-gray">Gerenciamento e monitoramento de backups</p>
        </div>
        <Button onClick={fetchBackups} className="bg-maginf-orange hover:bg-maginf-orange-dark">
          <RefreshCw className="h-4 w-4 mr-2" />
          Atualizar
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {backups.map((backup) => (
          <Card key={backup.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <HardDrive className="h-5 w-5 text-maginf-orange" />
                  <CardTitle className="text-lg">{backup.nome}</CardTitle>
                </div>
                <Badge className={getStatusColor(backup.status)}>
                  <div className="flex items-center space-x-1">
                    {getStatusIcon(backup.status)}
                    <span>{backup.status.replace('_', ' ')}</span>
                  </div>
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-maginf-gray">Origem:</p>
                  <p className="font-medium">{backup.origem}</p>
                </div>
                <div>
                  <p className="text-maginf-gray">Destino:</p>
                  <p className="font-medium">{backup.destino}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-maginf-gray">Última Execução:</p>
                  <p className="font-medium">{backup.ultimaExecucao}</p>
                </div>
                <div>
                  <p className="text-maginf-gray">Próxima Execução:</p>
                  <p className="font-medium">{backup.proximaExecucao}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-maginf-gray">Tamanho:</p>
                  <p className="font-medium">{backup.tamanho}</p>
                </div>
                <div>
                  <p className="text-maginf-gray">Duração:</p>
                  <p className="font-medium">{backup.duracao}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
