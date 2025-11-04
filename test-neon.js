// Teste de conexão com Neon
const { PrismaClient } = require('@prisma/client')

async function testNeon() {
  console.log('🔍 Testando conexão com Neon...')
  
  // Connection string do projeto portal.maginf no Neon
  const DATABASE_URL = "postgresql://neondb_owner:npg_XtNZYgqT4CM7@ep-lucky-leaf-acv77jwr-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
  
  if (DATABASE_URL === "COLE_AQUI_A_STRING_DO_NEON") {
    console.log('❌ Por favor, configure a DATABASE_URL do Neon')
    return
  }
  
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: DATABASE_URL
      }
    }
  })

  try {
    console.log('🔗 Conectando ao Neon...')
    await prisma.$connect()
    console.log('✅ Conexão com Neon OK!')
    
    // Teste de query
    const result = await prisma.$queryRaw`SELECT 1 as test`
    console.log('✅ Query test OK:', result)
    
    // Verificar se tabelas existem
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `
    console.log('📋 Tabelas encontradas:', tables.length)
    
    if (tables.length === 0) {
      console.log('💡 Banco vazio - execute: npx prisma db push')
    }
    
  } catch (error) {
    console.error('❌ Erro na conexão:', error.message)
    
    if (error.message.includes('ENOTFOUND')) {
      console.log('💡 Dica: Verifique se a URL do Neon está correta')
    }
    
    if (error.message.includes('authentication')) {
      console.log('💡 Dica: Verifique usuário e senha na connection string')
    }
    
  } finally {
    await prisma.$disconnect()
  }
}

testNeon()
