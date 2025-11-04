import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    console.log('[TEST-NEON] Iniciando teste de conexão...')
    
    // 1. Teste de conexão básica
    await prisma.$connect()
    console.log('[TEST-NEON] ✅ Conexão OK')
    
    // 2. Teste de query simples
    const testQuery = await prisma.$queryRaw`SELECT 1 as test, NOW() as timestamp`
    console.log('[TEST-NEON] ✅ Query test OK:', testQuery)
    
    // 3. Contar registros nas tabelas principais
    const userCount = await prisma.user.count()
    const tenantCount = await prisma.tenant.count()
    
    console.log('[TEST-NEON] ✅ Contagem de registros OK')
    
    // 4. Testar uma query mais complexa
    const users = await prisma.user.findMany({
      take: 3,
      include: {
        tenant: {
          select: {
            nome: true
          }
        }
      }
    })
    
    console.log('[TEST-NEON] ✅ Query complexa OK')
    
    // 5. Informações do banco
    const dbInfo = await prisma.$queryRaw`
      SELECT 
        current_database() as database_name,
        current_user as current_user,
        version() as postgres_version
    ` as any[]
    
    const response = {
      status: 'success',
      timestamp: new Date().toISOString(),
      database: {
        connected: true,
        info: dbInfo[0],
        counts: {
          users: userCount,
          tenants: tenantCount
        }
      },
      testQuery: testQuery,
      sampleUsers: users.map(u => ({
        id: u.id,
        nome: u.nome,
        email: u.email,
        role: u.role,
        tenant: u.tenant?.nome || 'Sem tenant'
      })),
      environment: {
        nodeEnv: process.env.NODE_ENV,
        hasDbUrl: !!process.env.DATABASE_URL,
        dbUrlPrefix: process.env.DATABASE_URL?.substring(0, 20) + '...'
      }
    }
    
    console.log('[TEST-NEON] ✅ Teste completo realizado com sucesso')
    
    return NextResponse.json(response)
    
  } catch (error) {
    console.error('[TEST-NEON] ❌ Erro no teste:', error)
    
    return NextResponse.json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: {
        message: error instanceof Error ? error.message : 'Erro desconhecido',
        type: error instanceof Error ? error.constructor.name : 'Unknown',
      },
      environment: {
        nodeEnv: process.env.NODE_ENV,
        hasDbUrl: !!process.env.DATABASE_URL,
        dbUrlPrefix: process.env.DATABASE_URL?.substring(0, 20) + '...'
      }
    }, { status: 500 })
    
  } finally {
    await prisma.$disconnect()
  }
}
