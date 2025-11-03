# Portal Maginf Tecnologia

Portal de monitoramento e gestão de TI para clientes da Maginf Tecnologia.

## 🚀 Funcionalidades

- **Dashboard completo** com visão geral do ambiente de TI
- **Monitoramento de servidores** com status em tempo real
- **Gestão de estações de trabalho** 
- **Controle de backups** com histórico e alertas
- **Sistema de alertas** com diferentes níveis de severidade
- **Relatórios personalizados** por período
- **Multi-tenant** com segregação total de dados
- **Controle de acesso** baseado em roles (RBAC)
- **Interface moderna** e responsiva

## 🛠️ Stack Tecnológica

- **Frontend**: Next.js 14, React, TypeScript
- **Backend**: Next.js API Routes
- **Banco de Dados**: PostgreSQL
- **ORM**: Prisma
- **Autenticação**: JWT
- **Estilização**: Tailwind CSS
- **Componentes**: Radix UI + shadcn/ui
- **Ícones**: Lucide React

## 📋 Pré-requisitos

- Node.js 18+ 
- PostgreSQL 12+
- npm ou yarn

## 🔧 Instalação e Configuração

### 1. Clone o repositório
```bash
git clone https://github.com/maginfnews/portal.git
cd portal
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure o banco de dados
```bash
# Crie um banco PostgreSQL
createdb portal_maginf

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o .env com suas configurações
```

### 4. Execute as migrations e seed
```bash
npx prisma db push
npx prisma generate
npm run db:seed
```

### 5. Execute o projeto
```bash
npm run dev
```

O projeto estará disponível em `http://localhost:3000`

## 👥 Credenciais de Teste

- **Admin Maginf**: `admin@maginf.com.br` / `admin123`
- **Maicon Maginf**: `maicon@maginf.com.br` / `mag1234`
- **Admin Cliente**: `admin@techcorp.com.br` / `cliente123`  
- **Usuário Cliente**: `user@techcorp.com.br` / `cliente123`

## 🏗️ Arquitetura

### Estrutura de Pastas
```
src/
├── app/                    # App Router do Next.js
│   ├── (public)/          # Rotas públicas (login)
│   ├── dashboard/         # Área protegida do portal
│   └── api/               # API Routes
├── components/            # Componentes React
│   └── ui/                # Componentes base (shadcn/ui)
├── lib/                   # Utilitários e configurações
└── middleware.ts          # Middleware de autenticação
```

### Banco de Dados
- **Multi-tenant**: Cada cliente tem dados segregados
- **RBAC**: 3 níveis de acesso (Maginf Admin, Cliente Admin, Cliente User)
- **Auditoria**: Timestamps em todas as tabelas
- **Relacionamentos**: Foreign keys para integridade referencial

## 🔐 Sistema de Autenticação

- **JWT** com cookies httpOnly
- **Middleware** para proteção de rotas
- **Multi-tenant** com isolamento de dados
- **Roles**: `MAGINF_ADMIN`, `CLIENTE_ADMIN`, `CLIENTE_USER`

## 📊 Providers de Monitoramento

O sistema foi projetado para integrar com APIs externas:

```typescript
interface IMonitoringProvider {
  getServersStatus(tenant: Tenant): Promise<ServerStatus[]>
  getWorkstationsStatus(tenant: Tenant): Promise<WorkstationStatus[]>
}

interface IBackupProvider {
  getBackupJobs(tenant: Tenant): Promise<BackupJobStatus[]>
}
```

Atualmente usa providers mock, mas pode ser facilmente substituído por integrações reais com:
- Site24x7
- Zabbix  
- N-able Cove
- Veeam
- Outros

## 🚀 Deploy no Vercel

### 1. Preparação
```bash
# Clone o repositório
git clone https://github.com/seu-usuario/portal-maginf.git
cd portal-maginf

# Instale as dependências
npm install

# Configure o banco de dados
npx prisma db push
npx prisma db seed
```

### 2. Deploy no Vercel
1. **Conecte o repositório** ao Vercel
2. **Configure as variáveis de ambiente** (veja seção abaixo)
3. **Deploy automático** a cada push na branch main

### 3. Variáveis de Ambiente para Produção

No painel do Vercel, configure:

```bash
# Database (PostgreSQL recomendado para produção)
DATABASE_URL="postgresql://username:password@host:5432/database"

# NextAuth
NEXTAUTH_URL="https://portal.maginf.com.br"
NEXTAUTH_SECRET="sua-chave-super-secreta-nextauth"

# Google OAuth (opcional)
GOOGLE_CLIENT_ID="123456789-abc.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-abcdefghijk"

# JWT (compatibilidade)
JWT_SECRET="sua-chave-super-secreta-jwt"
```

### 4. Configuração Google OAuth para Produção

No Google Cloud Console, adicione:
- **Authorized JavaScript origins**: `https://portal.maginf.com.br`
- **Authorized redirect URIs**: `https://portal.maginf.com.br/api/auth/callback/google`

## 📈 Próximos Passos

- [ ] Integração com APIs reais de monitoramento
- [ ] Sistema de notificações em tempo real
- [ ] Relatórios em PDF
- [ ] Dashboard mobile app
- [ ] Integração com WhatsApp/Telegram
- [ ] Sistema de tickets/chamados

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto é propriedade da Maginf Tecnologia.

## 📞 Suporte

Para suporte técnico, entre em contato:
- Email: suporte@maginf.com.br
- Website: https://maginf.com.br
