import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...')

  // Criar tenant de exemplo
  const tenantExample = await prisma.tenant.upsert({
    where: { cnpj: '12.345.678/0001-90' },
    update: {},
    create: {
      nome: 'TechCorp Ltda',
      cnpj: '12.345.678/0001-90',
      contatoPrincipal: 'João Silva - joao@techcorp.com.br',
      ativo: true,
    },
  })

  // Criar usuário admin da Maginf
  const hashedPasswordAdmin = await bcrypt.hash('admin123', 10)
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@maginf.com.br' },
    update: {},
    create: {
      nome: 'Admin Maginf',
      email: 'admin@maginf.com.br',
      senhaHash: hashedPasswordAdmin,
      role: 'MAGINF_ADMIN',
      ativo: true,
    },
  })

  // Criar usuário admin do cliente
  const hashedPasswordClient = await bcrypt.hash('cliente123', 10)
  const clientAdminUser = await prisma.user.upsert({
    where: { email: 'admin@techcorp.com.br' },
    update: {},
    create: {
      nome: 'João Silva',
      email: 'admin@techcorp.com.br',
      senhaHash: hashedPasswordClient,
      role: 'CLIENTE_ADMIN',
      tenantId: tenantExample.id,
      ativo: true,
    },
  })

  // Criar usuário comum do cliente
  const clientUser = await prisma.user.upsert({
    where: { email: 'user@techcorp.com.br' },
    update: {},
    create: {
      nome: 'Maria Santos',
      email: 'user@techcorp.com.br',
      senhaHash: hashedPasswordClient,
      role: 'CLIENTE_USER',
      tenantId: tenantExample.id,
      ativo: true,
    },
  })

  // Criar servidores de exemplo
  const servers = await Promise.all([
    prisma.server.create({
      data: {
        tenantId: tenantExample.id,
        nome: 'SRV-WEB-01',
        ip: '192.168.1.10',
        sistemaOperacional: 'Ubuntu 22.04 LTS',
        status: 'ONLINE',
        cpuUsoPercent: 25.5,
        memoriaUsoPercent: 68.2,
        discoUsoPercent: 45.8,
        ultimoCheckEm: new Date(),
      },
    }),
    prisma.server.create({
      data: {
        tenantId: tenantExample.id,
        nome: 'SRV-DB-01',
        ip: '192.168.1.11',
        sistemaOperacional: 'Windows Server 2022',
        status: 'ALERTA',
        cpuUsoPercent: 85.2,
        memoriaUsoPercent: 92.1,
        discoUsoPercent: 78.5,
        ultimoCheckEm: new Date(),
      },
    }),
    prisma.server.create({
      data: {
        tenantId: tenantExample.id,
        nome: 'SRV-FILE-01',
        ip: '192.168.1.12',
        sistemaOperacional: 'CentOS 8',
        status: 'OFFLINE',
        ultimoCheckEm: new Date(Date.now() - 30 * 60 * 1000), // 30 min atrás
      },
    }),
  ])

  // Criar estações de trabalho
  const workstations = await Promise.all([
    prisma.workstation.create({
      data: {
        tenantId: tenantExample.id,
        nome: 'WS-JOAO-01',
        usuarioResponsavel: 'João Silva',
        ip: '192.168.1.100',
        status: 'ONLINE',
        ultimoCheckEm: new Date(),
      },
    }),
    prisma.workstation.create({
      data: {
        tenantId: tenantExample.id,
        nome: 'WS-MARIA-02',
        usuarioResponsavel: 'Maria Santos',
        ip: '192.168.1.101',
        status: 'ONLINE',
        ultimoCheckEm: new Date(),
      },
    }),
    prisma.workstation.create({
      data: {
        tenantId: tenantExample.id,
        nome: 'WS-PEDRO-03',
        usuarioResponsavel: 'Pedro Costa',
        ip: '192.168.1.102',
        status: 'ALERTA',
        ultimoCheckEm: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2h atrás
      },
    }),
  ])

  // Criar jobs de backup
  const backupJobs = await Promise.all([
    prisma.backupJob.create({
      data: {
        tenantId: tenantExample.id,
        nome: 'Backup SRV-WEB-01',
        tipoAlvo: 'SERVIDOR',
        alvoId: servers[0].id,
        provedor: 'COVE',
        ultimaExecucaoEm: new Date(),
        ultimaExecucaoStatus: 'SUCESSO',
        tamanhoUltimoBackupGB: 125.5,
        retencaoDias: 30,
      },
    }),
    prisma.backupJob.create({
      data: {
        tenantId: tenantExample.id,
        nome: 'Backup SRV-DB-01',
        tipoAlvo: 'SERVIDOR',
        alvoId: servers[1].id,
        provedor: 'VEEAM',
        ultimaExecucaoEm: new Date(Date.now() - 24 * 60 * 60 * 1000), // 24h atrás
        ultimaExecucaoStatus: 'FALHA',
        retencaoDias: 60,
      },
    }),
    prisma.backupJob.create({
      data: {
        tenantId: tenantExample.id,
        nome: 'Backup WS-JOAO-01',
        tipoAlvo: 'ESTACAO',
        alvoId: workstations[0].id,
        provedor: 'COVE',
        ultimaExecucaoEm: new Date(),
        ultimaExecucaoStatus: 'SUCESSO',
        tamanhoUltimoBackupGB: 45.2,
        retencaoDias: 15,
      },
    }),
  ])

  // Criar alertas
  await Promise.all([
    prisma.alert.create({
      data: {
        tenantId: tenantExample.id,
        tipo: 'CPU_ALTA',
        severidade: 'WARNING',
        mensagem: 'CPU do servidor SRV-DB-01 está em 85%',
        origem: 'SERVIDOR',
        origemId: servers[1].id,
        criadoEm: new Date(),
      },
    }),
    prisma.alert.create({
      data: {
        tenantId: tenantExample.id,
        tipo: 'MEMORIA_ALTA',
        severidade: 'CRITICAL',
        mensagem: 'Memória do servidor SRV-DB-01 está em 92%',
        origem: 'SERVIDOR',
        origemId: servers[1].id,
        criadoEm: new Date(),
      },
    }),
    prisma.alert.create({
      data: {
        tenantId: tenantExample.id,
        tipo: 'SERVIDOR_OFFLINE',
        severidade: 'CRITICAL',
        mensagem: 'Servidor SRV-FILE-01 está offline há 30 minutos',
        origem: 'SERVIDOR',
        origemId: servers[2].id,
        criadoEm: new Date(Date.now() - 30 * 60 * 1000),
      },
    }),
    prisma.alert.create({
      data: {
        tenantId: tenantExample.id,
        tipo: 'BACKUP_FALHO',
        severidade: 'WARNING',
        mensagem: 'Backup do SRV-DB-01 falhou na última execução',
        origem: 'BACKUP',
        origemId: backupJobs[1].id,
        criadoEm: new Date(Date.now() - 24 * 60 * 60 * 1000),
      },
    }),
  ])

  // Criar configuração de integração
  await prisma.integrationConfig.create({
    data: {
      tenantId: tenantExample.id,
      tipo: 'MONITORING',
      provedor: 'SITE24X7',
      apiKey: 'mock-api-key-encrypted',
      endpointBase: 'https://api.site24x7.com',
      ativo: true,
    },
  })

  console.log('✅ Seed concluído com sucesso!')
  console.log(`👤 Admin Maginf: admin@maginf.com.br / admin123`)
  console.log(`👤 Admin Cliente: admin@techcorp.com.br / cliente123`)
  console.log(`👤 Usuário Cliente: user@techcorp.com.br / cliente123`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
