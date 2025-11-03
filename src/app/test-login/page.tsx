'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function TestLoginPage() {
  const [email, setEmail] = useState('maicon@maginf.com.br')
  const [password, setPassword] = useState('mag1234')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testLogin = async () => {
    setLoading(true)
    setResult(null)

    try {
      console.log('Testando login...')
      
      // 1. Fazer login
      const loginResponse = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const loginData = await loginResponse.json()
      console.log('Resposta do login:', loginData)

      if (!loginResponse.ok) {
        throw new Error(loginData.error || 'Erro no login')
      }

      // 2. Verificar se o cookie foi definido
      const cookies = document.cookie
      console.log('Cookies após login:', cookies)

      // 3. Testar acesso ao /api/me
      await new Promise(resolve => setTimeout(resolve, 500)) // Aguardar 500ms
      
      const meResponse = await fetch('/api/me')
      const meData = await meResponse.json()
      console.log('Resposta do /api/me:', meData)

      // 4. Testar acesso direto ao dashboard
      const dashResponse = await fetch('/dashboard')
      console.log('Status do dashboard:', dashResponse.status)

      setResult({
        login: {
          status: loginResponse.status,
          data: loginData,
          success: loginResponse.ok
        },
        cookies: cookies,
        me: {
          status: meResponse.status,
          data: meData,
          success: meResponse.ok
        },
        dashboard: {
          status: dashResponse.status,
          success: dashResponse.ok
        }
      })

      if (loginResponse.ok && meResponse.ok && dashResponse.ok) {
        console.log('✅ Tudo funcionando! Redirecionando...')
        setTimeout(() => {
          window.location.href = '/dashboard'
        }, 2000)
      }

    } catch (error) {
      console.error('Erro no teste:', error)
      setResult({
        error: error.message
      })
    } finally {
      setLoading(false)
    }
  }

  const clearCookies = () => {
    document.cookie.split(";").forEach(function(c) { 
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
    });
    window.location.reload()
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Teste de Login Completo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email:</label>
              <Input 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Senha:</label>
              <Input 
                type="password"
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>
          
          <div className="flex space-x-4">
            <Button 
              onClick={testLogin} 
              disabled={loading}
              className="bg-maginf-orange hover:bg-maginf-orange-dark"
            >
              {loading ? 'Testando...' : 'Testar Login Completo'}
            </Button>
            
            <Button 
              onClick={clearCookies} 
              variant="outline"
              disabled={loading}
            >
              Limpar Cookies
            </Button>
          </div>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Resultado do Teste</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-sm overflow-auto bg-gray-100 p-4 rounded">
              {JSON.stringify(result, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
