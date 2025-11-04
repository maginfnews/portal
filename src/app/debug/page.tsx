'use client'

import { useState, useEffect } from 'react'

interface DebugInfo {
  [key: string]: any
}

export default function DebugPage() {
  const [info, setInfo] = useState<DebugInfo>({})

  useEffect(() => {
    const debugInfo = {
      url: window.location.href,
      userAgent: navigator.userAgent,
      cookies: document.cookie,
      timestamp: new Date().toISOString(),
      localStorage: Object.keys(localStorage).length,
      sessionStorage: Object.keys(sessionStorage).length,
    }
    setInfo(debugInfo)

    // Testar API de login
    fetch('/api/me')
      .then(res => res.json())
      .then(data => {
        setInfo((prev: DebugInfo) => ({ ...prev, authStatus: data }))
      })
      .catch(err => {
        setInfo((prev: DebugInfo) => ({ ...prev, authError: err.message }))
      })
  }, [])

  const testLogin = async () => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'maicon@maginf.com.br',
          password: 'mag1234'
        })
      })
      
      const data = await response.json()
      setInfo((prev: DebugInfo) => ({ ...prev, loginTest: { status: response.status, data } }))
    } catch (error) {
      setInfo((prev: DebugInfo) => ({ ...prev, loginError: error }))
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Debug Portal Maginf</h1>
      
      <div className="space-y-4">
        <button 
          onClick={testLogin}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Testar Login
        </button>
        
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="font-bold mb-2">Informações do Sistema:</h2>
          <pre className="text-sm overflow-auto">
            {JSON.stringify(info, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  )
}
