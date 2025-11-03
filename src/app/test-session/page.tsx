'use client'

import { useSession } from 'next-auth/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function TestSessionPage() {
  const { data: session, status } = useSession()

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Teste de Sessão NextAuth</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <strong>Status:</strong> {status}
            </div>
            
            {status === 'loading' && (
              <div>Carregando sessão...</div>
            )}
            
            {status === 'unauthenticated' && (
              <div className="text-red-600">Não autenticado</div>
            )}
            
            {status === 'authenticated' && session && (
              <div className="space-y-2">
                <div className="text-green-600">✅ Autenticado com sucesso!</div>
                <div><strong>Email:</strong> {session.user?.email}</div>
                <div><strong>Nome:</strong> {session.user?.name}</div>
                <div><strong>Role:</strong> {session.user?.role}</div>
                <div><strong>ID:</strong> {session.user?.id}</div>
                <div><strong>Tenant ID:</strong> {session.user?.tenantId || 'Nenhum'}</div>
              </div>
            )}
            
            <div className="mt-6">
              <h3 className="font-bold mb-2">Sessão Completa:</h3>
              <pre className="text-sm bg-gray-100 p-4 rounded overflow-auto">
                {JSON.stringify(session, null, 2)}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
