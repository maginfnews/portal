'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, Download, Calendar, BarChart3, PieChart, TrendingUp } from 'lucide-react'

interface RelatorioTemplate {
  id: string
  nome: string
  descricao: string
  tipo: 'performance' | 'backup' | 'seguranca' | 'uptime'
  icon: any
  ultimaGeracao: string
}

export default function RelatoriosPage() {
  const [generating, setGenerating] = useState<string | null>(null)

  const templates: RelatorioTemplate[] = [
    {
      id: '1',
      nome: 'Relatório de Performance',
      descricao: 'Análise detalhada de CPU, memória e disco dos servidores',
      tipo: 'performance',
      icon: BarChart3,
      ultimaGeracao: '2 dias atrás'
    },
    {
      id: '2',
      nome: 'Relatório de Backups',
      descricao: 'Status e histórico de todos os backups realizados',
      tipo: 'backup',
      icon: FileText,
      ultimaGeracao: '1 dia atrás'
    },
    {
      id: '3',
      nome: 'Relatório de Uptime',
      descricao: 'Disponibilidade e tempo de atividade dos serviços',
      tipo: 'uptime',
      icon: TrendingUp,
      ultimaGeracao: '3 dias atrás'
    },
    {
      id: '4',
      nome: 'Relatório de Segurança',
      descricao: 'Alertas de segurança e eventos críticos',
      tipo: 'seguranca',
      icon: PieChart,
      ultimaGeracao: '1 semana atrás'
    }
  ]

  const handleGenerate = async (relatorioId: string) => {
    setGenerating(relatorioId)
    // Simular geração de relatório
    setTimeout(() => {
      setGenerating(null)
      // Aqui você faria o download do relatório
      alert('Relatório gerado com sucesso!')
    }, 3000)
  }

  const getTypeColor = (tipo: string) => {
    switch (tipo) {
      case 'performance': return 'text-blue-600'
      case 'backup': return 'text-green-600'
      case 'uptime': return 'text-purple-600'
      case 'seguranca': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Relatórios</h1>
          <p className="text-maginf-gray">Geração de relatórios e análises</p>
        </div>
      </div>

      {/* Relatórios Rápidos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="text-center p-6">
          <Calendar className="h-8 w-8 text-maginf-orange mx-auto mb-2" />
          <h3 className="font-semibold">Relatório Diário</h3>
          <p className="text-sm text-maginf-gray mb-4">Resumo das últimas 24h</p>
          <Button size="sm" className="bg-maginf-orange hover:bg-maginf-orange-dark">
            Gerar
          </Button>
        </Card>

        <Card className="text-center p-6">
          <BarChart3 className="h-8 w-8 text-blue-600 mx-auto mb-2" />
          <h3 className="font-semibold">Relatório Semanal</h3>
          <p className="text-sm text-maginf-gray mb-4">Análise dos últimos 7 dias</p>
          <Button size="sm" variant="outline">
            Gerar
          </Button>
        </Card>

        <Card className="text-center p-6">
          <PieChart className="h-8 w-8 text-green-600 mx-auto mb-2" />
          <h3 className="font-semibold">Relatório Mensal</h3>
          <p className="text-sm text-maginf-gray mb-4">Resumo do mês atual</p>
          <Button size="sm" variant="outline">
            Gerar
          </Button>
        </Card>

        <Card className="text-center p-6">
          <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-2" />
          <h3 className="font-semibold">Relatório Customizado</h3>
          <p className="text-sm text-maginf-gray mb-4">Período personalizado</p>
          <Button size="sm" variant="outline">
            Configurar
          </Button>
        </Card>
      </div>

      {/* Templates de Relatórios */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Templates de Relatórios</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {templates.map((template) => (
            <Card key={template.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <template.icon className={`h-6 w-6 ${getTypeColor(template.tipo)}`} />
                  <div>
                    <CardTitle className="text-lg">{template.nome}</CardTitle>
                    <p className="text-sm text-maginf-gray mt-1">{template.descricao}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-maginf-gray">
                    Última geração: {template.ultimaGeracao}
                  </span>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleGenerate(template.id)}
                      disabled={generating === template.id}
                    >
                      {generating === template.id ? (
                        <>Gerando...</>
                      ) : (
                        <>
                          <Download className="h-4 w-4 mr-1" />
                          Gerar PDF
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Histórico de Relatórios */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Relatórios Recentes</h2>
        <Card>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-200">
              {[
                { nome: 'Relatório de Performance - Novembro 2024', data: '01/11/2024', tamanho: '2.3 MB' },
                { nome: 'Relatório de Backups - Outubro 2024', data: '31/10/2024', tamanho: '1.8 MB' },
                { nome: 'Relatório de Uptime - Outubro 2024', data: '30/10/2024', tamanho: '1.2 MB' },
              ].map((relatorio, index) => (
                <div key={index} className="flex items-center justify-between p-4">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-maginf-orange" />
                    <div>
                      <p className="font-medium">{relatorio.nome}</p>
                      <p className="text-sm text-maginf-gray">{relatorio.data} • {relatorio.tamanho}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
