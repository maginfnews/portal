# 🚀 Deploy Portal Maginf no Vercel

## 📋 Pré-requisitos

1. **Conta no GitHub** - Para hospedar o código
2. **Conta no Vercel** - Para deploy da aplicação
3. **Banco PostgreSQL** - Supabase, Neon, ou outro provider

## 🔧 Passo a Passo

### 1. Publicar no GitHub

```bash
# Inicializar repositório Git
git init
git add .
git commit -m "feat: Portal Maginf inicial com NextAuth e Google OAuth"

# Conectar ao repositório remoto
git remote add origin https://github.com/seu-usuario/portal-maginf.git
git branch -M main
git push -u origin main
```

### 2. Configurar Banco de Dados

**Opção A: Supabase (Recomendado)**
1. Acesse [supabase.com](https://supabase.com)
2. Crie um novo projeto
3. Copie a `DATABASE_URL` da seção Settings → Database

**Opção B: Neon**
1. Acesse [neon.tech](https://neon.tech)
2. Crie um novo projeto
3. Copie a connection string

### 3. Deploy no Vercel

1. **Acesse** [vercel.com](https://vercel.com)
2. **Conecte** sua conta GitHub
3. **Importe** o repositório `portal-maginf`
4. **Configure** as variáveis de ambiente:

```bash
# Database
DATABASE_URL="postgresql://username:password@host:5432/database"

# NextAuth
NEXTAUTH_URL="https://seu-projeto.vercel.app"
NEXTAUTH_SECRET="sua-chave-super-secreta-nextauth-aleatoria"

# Google OAuth
GOOGLE_CLIENT_ID="seu-google-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-seu-google-client-secret"

# JWT (compatibilidade)
JWT_SECRET="sua-chave-super-secreta-jwt-aleatoria"
```

5. **Deploy** - Clique em "Deploy"

### 4. Configurar Google OAuth

No Google Cloud Console:
1. **Vá em**: APIs & Services → Credentials
2. **Edite** o OAuth 2.0 Client ID existente
3. **Adicione** as URLs do Vercel:

```
Authorized JavaScript origins:
- https://seu-projeto.vercel.app

Authorized redirect URIs:
- https://seu-projeto.vercel.app/api/auth/callback/google
```

### 5. Configurar Domínio Customizado (Opcional)

1. **No Vercel**: Settings → Domains
2. **Adicione**: `portal.maginf.com.br`
3. **Configure DNS** conforme instruções
4. **Atualize** `NEXTAUTH_URL` para o domínio final

## ✅ Verificação

Após o deploy, teste:

1. **Acesso geral**: `https://seu-projeto.vercel.app`
2. **Login email/senha**: Use credenciais do seed
3. **Login Google**: Teste com sua conta Google
4. **Dashboard**: Navegue pelas páginas
5. **Logout**: Teste o botão de sair

## 🔧 Troubleshooting

### Erro de Build
- Verifique se `DATABASE_URL` está configurada
- Confirme que todas as variáveis estão definidas

### Erro de OAuth
- Verifique URLs no Google Cloud Console
- Confirme `NEXTAUTH_URL` está correto

### Erro de Database
- Teste conexão com o banco
- Verifique se as tabelas foram criadas

## 📞 Suporte

Para problemas:
- **Logs**: Vercel → Functions → View Function Logs
- **Database**: Supabase → Logs
- **OAuth**: Google Cloud Console → Logs

---

**Portal pronto para produção! 🎉**
