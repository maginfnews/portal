'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Settings, User, Bell, Shield, Database, Wifi } from 'lucide-react'

export default function ConfiguracoesPage() {
  const [activeTab, setActiveTab] = useState('perfil')
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      alert('Configurações salvas com sucesso!')
    }, 1500)
  }

  const tabs = [
    { id: 'perfil', label: 'Perfil', icon: User },
    { id: 'notificacoes', label: 'Notificações', icon: Bell },
    { id: 'seguranca', label: 'Segurança', icon: Shield },
    { id: 'integracao', label: 'Integrações', icon: Wifi },
    { id: 'sistema', label: 'Sistema', icon: Database },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
        <p className="text-maginf-gray">Gerencie as configurações do sistema</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Menu lateral */}
        <div className="lg:w-64">
          <Card>
            <CardContent className="p-0">
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                      activeTab === tab.id ? 'bg-maginf-orange text-white hover:bg-maginf-orange-dark' : 'text-gray-700'
                    }`}
                  >
                    <tab.icon className="h-5 w-5" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Conteúdo */}
        <div className="flex-1">
          {activeTab === 'perfil' && (
            <Card>
              <CardHeader>
                <CardTitle>Informações do Perfil</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome Completo
                    </label>
                    <Input defaultValue="Maicon Maginf" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <Input defaultValue="maicon@maginf.com.br" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cargo
                    </label>
                    <Input defaultValue="Administrador" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Telefone
                    </label>
                    <Input defaultValue="(11) 99999-9999" />
                  </div>
                </div>
                <Button onClick={handleSave} disabled={saving} className="bg-maginf-orange hover:bg-maginf-orange-dark">
                  {saving ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
              </CardContent>
            </Card>
          )}

          {activeTab === 'notificacoes' && (
            <Card>
              <CardHeader>
                <CardTitle>Configurações de Notificações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Alertas Críticos</h4>
                      <p className="text-sm text-maginf-gray">Receber notificações de alertas críticos</p>
                    </div>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Relatórios Semanais</h4>
                      <p className="text-sm text-maginf-gray">Receber relatórios semanais por email</p>
                    </div>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Falhas de Backup</h4>
                      <p className="text-sm text-maginf-gray">Notificar quando backups falharem</p>
                    </div>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                </div>
                <Button onClick={handleSave} disabled={saving} className="bg-maginf-orange hover:bg-maginf-orange-dark">
                  {saving ? 'Salvando...' : 'Salvar Configurações'}
                </Button>
              </CardContent>
            </Card>
          )}

          {activeTab === 'seguranca' && (
            <Card>
              <CardHeader>
                <CardTitle>Configurações de Segurança</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Senha Atual
                  </label>
                  <Input type="password" placeholder="Digite sua senha atual" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nova Senha
                  </label>
                  <Input type="password" placeholder="Digite a nova senha" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirmar Nova Senha
                  </label>
                  <Input type="password" placeholder="Confirme a nova senha" />
                </div>
                <div className="pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Autenticação de Dois Fatores</h4>
                      <p className="text-sm text-maginf-gray">Adicionar camada extra de segurança</p>
                    </div>
                    <Button variant="outline">Configurar</Button>
                  </div>
                </div>
                <Button onClick={handleSave} disabled={saving} className="bg-maginf-orange hover:bg-maginf-orange-dark">
                  {saving ? 'Salvando...' : 'Alterar Senha'}
                </Button>
              </CardContent>
            </Card>
          )}

          {activeTab === 'integracao' && (
            <Card>
              <CardHeader>
                <CardTitle>Integrações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Monitoramento PRTG</h4>
                        <p className="text-sm text-maginf-gray">Integração com sistema de monitoramento</p>
                      </div>
                      <Button variant="outline">Configurar</Button>
                    </div>
                  </div>
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Backup Veeam</h4>
                        <p className="text-sm text-maginf-gray">Integração com Veeam Backup</p>
                      </div>
                      <Button variant="outline">Configurar</Button>
                    </div>
                  </div>
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Slack/Teams</h4>
                        <p className="text-sm text-maginf-gray">Notificações via Slack ou Teams</p>
                      </div>
                      <Button variant="outline">Configurar</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'sistema' && (
            <Card>
              <CardHeader>
                <CardTitle>Configurações do Sistema</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Intervalo de Monitoramento (minutos)
                    </label>
                    <Input type="number" defaultValue="5" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Retenção de Logs (dias)
                    </label>
                    <Input type="number" defaultValue="30" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Timeout de Conexão (segundos)
                    </label>
                    <Input type="number" defaultValue="30" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Máximo de Alertas por Hora
                    </label>
                    <Input type="number" defaultValue="10" />
                  </div>
                </div>
                <Button onClick={handleSave} disabled={saving} className="bg-maginf-orange hover:bg-maginf-orange-dark">
                  {saving ? 'Salvando...' : 'Salvar Configurações'}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
