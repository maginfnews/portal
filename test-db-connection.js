// Teste de conexão com Supabase
const { PrismaClient } = require('@prisma/client')

async function testConnection() {
  console.log('🔍 Testando conexão com Supabase...')
  
  // Testando diferentes formatos de connection string
  const DATABASE_URLS = [
    "postgresql://postgres:SyNj2Nvbhir4rfbv@db.hltezhhhtyjtgadrlvhv.supabase.co:5432/postgres",
    "postgresql://postgres:SyNj2Nvbhir4rfbv@db.hltezhhhtyjtgadrlvhv.supabase.co:6543/postgres",
    "postgresql://postgres.hltezhhhtyjtgadrlvhv:SyNj2Nvbhir4rfbv@aws-0-sa-east-1.pooler.supabase.com:6543/postgres"
  ]
  
  for (let i = 0; i < DATABASE_URLS.length; i++) {
    const DATABASE_URL = DATABASE_URLS[i]
    console.log(`\n🔗 Testando URL ${i + 1}:`, DATABASE_URL.replace(/:[^:@]*@/, ':***@'))
    
    const prisma = new PrismaClient({
      datasources: {
        db: {
          url: DATABASE_URL
        }
      }
    })

    try {
      // Teste simples de conexão
      await prisma.$connect()
      console.log('✅ Conexão com Supabase OK!')
      
      // Teste de query
      const result = await prisma.$queryRaw`SELECT 1 as test`
      console.log('✅ Query test OK:', result)
      
      // Verificar se tabelas existem
      const tables = await prisma.$queryRaw`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
      `
      console.log('📋 Tabelas encontradas:', tables)
      
      // Se chegou aqui, conexão funcionou
      await prisma.$disconnect()
      console.log('🎉 Conexão funcionando! Usando esta URL.')
      return DATABASE_URL
      
    } catch (error) {
      console.error('❌ Erro na conexão:', error.message)
      
      if (error.message.includes('timeout')) {
        console.log('💡 Dica: Projeto pode estar pausado. Acesse o Supabase dashboard.')
      }
      
      if (error.message.includes('authentication')) {
        console.log('💡 Dica: Verifique a senha na connection string.')
      }
      
      await prisma.$disconnect()
    }
  }
  
  console.log('\n❌ Nenhuma connection string funcionou.')
  console.log('💡 Verifique se o projeto está ativo no Supabase dashboard.')
}

testConnection()
