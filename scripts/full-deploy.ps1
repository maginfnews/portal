# Script de Deploy Completo - Portal Maginf
param(
    [switch]$SkipDatabase,
    [switch]$SkipOAuth
)

Write-Host "DEPLOY COMPLETO - PORTAL MAGINF" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green

# 1. Verificar dependências
Write-Host "Verificando dependencias..." -ForegroundColor Yellow
try {
    vercel --version | Out-Null
    Write-Host "Vercel CLI OK" -ForegroundColor Green
} catch {
    Write-Host "Instalando Vercel CLI..." -ForegroundColor Red
    npm install -g vercel
}

# 2. Login no Vercel
Write-Host "Login no Vercel..." -ForegroundColor Yellow
vercel login

# 3. Deploy inicial
Write-Host "Fazendo deploy inicial..." -ForegroundColor Yellow
vercel --prod

# 4. Configurar banco de dados
if (-not $SkipDatabase) {
    Write-Host "Configurando banco de dados..." -ForegroundColor Yellow
    & "$PSScriptRoot\setup-database.ps1"
}

# 5. Configurar OAuth
if (-not $SkipOAuth) {
    Write-Host "Configurando OAuth..." -ForegroundColor Yellow
    & "$PSScriptRoot\setup-oauth.ps1"
}

# 6. Configurar variáveis de ambiente
Write-Host "Configurando variaveis de ambiente..." -ForegroundColor Yellow
Write-Host "Acesse o dashboard do Vercel para configurar:" -ForegroundColor Cyan
Write-Host "https://vercel.com/dashboard" -ForegroundColor White

$envVars = @"
# Variáveis de ambiente necessárias:

DATABASE_URL=postgresql://username:password@host:5432/database
NEXTAUTH_URL=https://seu-projeto.vercel.app
NEXTAUTH_SECRET=sua-chave-super-secreta-nextauth-aleatoria
GOOGLE_CLIENT_ID=seu-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-seu-google-client-secret
JWT_SECRET=sua-chave-super-secreta-jwt-aleatoria
"@

Write-Host $envVars -ForegroundColor White
$envVars | Set-Clipboard

Write-Host "Variaveis copiadas para area de transferencia!" -ForegroundColor Green

# 7. Abrir dashboard do Vercel
Write-Host "Abrindo dashboard do Vercel..." -ForegroundColor Yellow
Start-Process "https://vercel.com/dashboard"

Write-Host "DEPLOY COMPLETO!" -ForegroundColor Green
Write-Host "Checklist final:" -ForegroundColor Cyan
Write-Host "- Configurar variaveis de ambiente no Vercel" -ForegroundColor White
Write-Host "- Configurar banco PostgreSQL" -ForegroundColor White
Write-Host "- Atualizar URLs do Google OAuth" -ForegroundColor White
Write-Host "- Testar login e funcionalidades" -ForegroundColor White
