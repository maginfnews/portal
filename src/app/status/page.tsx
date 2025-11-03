'use client'

import { useState, useEffect } from 'react'

export default function StatusPage() {
  const [status, setStatus] = useState<any>({})

  useEffect(() => {
    checkStatus()
  }, [])

  const checkStatus = async () => {
    try {
      // Verificar se já está logado
      const meResponse = await fetch('/api/me')
      const meData = await meResponse.json()
      
      setStatus(prev => ({
        ...prev,
        currentAuth: {
          status: meResponse.status,
          data: meData
        }
      }))

      // Testar acesso ao dashboard
      const dashResponse = await fetch('/dashboard')
      setStatus(prev => ({
        ...prev,
        dashboardAccess: {
          status: dashResponse.status,
          ok: dashResponse.ok
        }
      }))

    } catch (error) {
      setStatus(prev => ({
        ...prev,
        error: error.message
      }))
    }
  }

  const goToDashboard = () => {
    window.location.href = '/dashboard'
  }

  const goToLogin = () => {
    window.location.href = '/login'
  }

  const clearCookies = () => {
    document.cookie.split(";").forEach(function(c) { 
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
    });
    window.location.reload()
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Status do Portal</h1>
      
      <div className="space-y-4">
        <div className="flex space-x-4">
          <button 
            onClick={goToDashboard}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Ir para Dashboard
          </button>
          
          <button 
            onClick={goToLogin}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Ir para Login
          </button>
          
          <button 
            onClick={clearCookies}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Limpar Cookies
          </button>
        </div>
        
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="font-bold mb-2">Status Atual:</h2>
          <pre className="text-sm overflow-auto">
            {JSON.stringify(status, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  )
}
