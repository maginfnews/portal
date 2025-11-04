'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Settings, 
  Server, 
  Database, 
  Shield, 
  Plus,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react'

interface Integration {
  id: string
  name: string
  type: string
  status: 'connected' | 'disconnected' | 'error'
  config?: any
}

export default function IntegracoesPage() {
  const [integrations, setIntegrations] = useState<Integration[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [newIntegration, setNewIntegration] = useState({
    type: '',
    name: '',
    url: '',
    username: '',
    password: '',
    apiKey: ''
  })

  useEffect(() => {
    loadIntegrations()
  }, [])

  const loadIntegrations = async () => {
    try {
      const response = await fetch('/api/integrations')
      const data = await response.json()
      setIntegrations(data.integrations || [])
    } catch (error) {
      console.error('Erro ao carregar integrações:', error)
    }
  }

  const testConnection = async (integration: Integration) => {
    try {
      const response = await fetch(`/api/integrations/${integration.id}/test`)
      const data = await response.json()
      
      if (data.success) {
        alert('Conexão testada com sucesso!')
        loadIntegrations()
      } else {
        alert('Erro na conexão: ' + data.error)
      }
    } catch (error) {
      alert('Erro ao testar conexão')
    }
  }

  const addIntegration = async () => {
    try {
      const response = await fetch('/api/integrations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newIntegration)
      })

      if (response.ok) {
        setShowAddForm(false)
        setNewIntegration({
          type: '',
          name: '',
          url: '',
          username: '',
          password: '',
          apiKey: ''
        })
        loadIntegrations()
      }
    } catch (error) {
      console.error('Erro ao adicionar integração:', error)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'zabbix':
      case 'prtg':
      case 'nagios':
        return <Server className="h-8 w-8 text-blue-500" />
      case 'veeam':
      case 'acronis':
        return <Database className="h-8 w-8 text-green-500" />
      default:
        return <Shield className="h-8 w-8 text-gray-500" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Integrações</h1>
          <p className="text-gray-600">Configure conexões com sistemas de monitoramento e backup</p>
        </div>
        <Button 
          onClick={() => setShowAddForm(true)}
          className="bg-maginf-blue hover:bg-maginf-blue/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nova Integração
        </Button>
      </div>

      {/* Integrações Disponíveis */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Zabbix */}
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Server className="h-8 w-8 text-blue-500" />
                <div>
                  <CardTitle className="text-lg">Zabbix</CardTitle>
                  <CardDescription>Monitoramento de infraestrutura</CardDescription>
                </div>
              </div>
              {getStatusIcon('disconnected')}
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Monitore servidores, rede e aplicações em tempo real
            </p>
            <Button variant="outline" size="sm" className="w-full">
              Configurar
            </Button>
          </CardContent>
        </Card>

        {/* PRTG */}
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Server className="h-8 w-8 text-green-500" />
                <div>
                  <CardTitle className="text-lg">PRTG</CardTitle>
                  <CardDescription>Network Monitor</CardDescription>
                </div>
              </div>
              {getStatusIcon('disconnected')}
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Monitoramento de rede, largura de banda e dispositivos
            </p>
            <Button variant="outline" size="sm" className="w-full">
              Configurar
            </Button>
          </CardContent>
        </Card>

        {/* Veeam */}
        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Database className="h-8 w-8 text-purple-500" />
                <div>
                  <CardTitle className="text-lg">Veeam</CardTitle>
                  <CardDescription>Backup & Replication</CardDescription>
                </div>
              </div>
              {getStatusIcon('disconnected')}
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Gestão de backups e recuperação de dados
            </p>
            <Button variant="outline" size="sm" className="w-full">
              Configurar
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Integrações Configuradas */}
      {integrations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              Integrações Configuradas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {integrations.map((integration) => (
                <div key={integration.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getTypeIcon(integration.type)}
                    <div>
                      <h3 className="font-medium">{integration.name}</h3>
                      <p className="text-sm text-gray-500 capitalize">{integration.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(integration.status)}
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => testConnection(integration)}
                    >
                      Testar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Instruções */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-800">Como Configurar Integrações</CardTitle>
        </CardHeader>
        <CardContent className="text-blue-700">
          <div className="space-y-2">
            <p><strong>1. Zabbix:</strong> Configure API endpoint, usuário e senha</p>
            <p><strong>2. PRTG:</strong> Configure URL do servidor e credenciais</p>
            <p><strong>3. Veeam:</strong> Configure API REST e autenticação</p>
            <p><strong>4. Teste:</strong> Sempre teste a conexão após configurar</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
