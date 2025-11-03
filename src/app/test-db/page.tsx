'use client'

import { useState, useEffect } from 'react'

export default function TestDbPage() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    testDatabase()
  }, [])

  const testDatabase = async () => {
    try {
      const response = await fetch('/api/test-db')
      const data = await response.json()
      setUsers(data.users || [])
    } catch (error) {
      console.error('Erro ao testar DB:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="p-8">Carregando...</div>
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Teste do Banco de Dados</h1>
      
      <div className="bg-gray-100 p-4 rounded">
        <h2 className="font-bold mb-2">Usuários no banco:</h2>
        <pre className="text-sm overflow-auto">
          {JSON.stringify(users, null, 2)}
        </pre>
      </div>
    </div>
  )
}
