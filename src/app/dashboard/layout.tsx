'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { 
  LayoutDashboard, 
  Server, 
  Monitor, 
  HardDrive, 
  AlertTriangle, 
  FileText, 
  Settings, 
  LogOut,
  Menu,
  X
} from 'lucide-react'

interface User {
  id: string
  nome: string
  email: string
  role: string
  tenant?: {
    id: string
    nome: string
  }
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<User | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchUser()
  }, [])

  const fetchUser = async () => {
    try {
      const response = await fetch('/api/me')
      if (response.ok) {
        const data = await response.json()
        setUser(data.data.user)
      } else {
        router.push('/login')
      }
    } catch (error) {
      console.error('Erro ao buscar usuário:', error)
      router.push('/login')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/login')
    } catch (error) {
      console.error('Erro no logout:', error)
    }
  }

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
    { icon: Server, label: 'Servidores', href: '/dashboard/servidores' },
    { icon: Monitor, label: 'Estações', href: '/dashboard/estacoes' },
    { icon: HardDrive, label: 'Backups', href: '/dashboard/backups' },
    { icon: AlertTriangle, label: 'Alertas', href: '/dashboard/alertas' },
    { icon: FileText, label: 'Relatórios', href: '/dashboard/relatorios' },
    { icon: Settings, label: 'Configurações', href: '/dashboard/configuracoes' },
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-maginf-orange border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-maginf-gray">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden mr-2"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-maginf-orange rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">M</span>
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">Maginf Tecnologia</h1>
                  {user?.tenant && (
                    <p className="text-sm text-maginf-gray">{user.tenant.nome}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.nome}</p>
                <p className="text-xs text-maginf-gray">{user?.role.replace('_', ' ')}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="text-maginf-gray hover:text-maginf-orange"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50
          w-64 bg-white shadow-lg border-r border-gray-200
          transition-transform duration-300 ease-in-out
          lg:transition-none
        `}>
          <div className="h-full flex flex-col">
            <nav className="flex-1 px-4 py-6 space-y-2">
              {menuItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium text-maginf-gray hover:text-maginf-orange hover:bg-orange-50 transition-colors"
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </a>
              ))}
            </nav>
          </div>
        </aside>

        {/* Overlay para mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main content */}
        <main className="flex-1 lg:ml-0">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
