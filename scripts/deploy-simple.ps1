# Script de Deploy Simples - Portal Maginf
Write-Host "PORTAL MAGINF - DEPLOY AUTOMATICO" -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Green

# 1. Verificar Vercel CLI
Write-Host "Verificando Vercel CLI..." -ForegroundColor Yellow
try {
    $vercelVersion = vercel --version
    Write-Host "Vercel CLI encontrado: $vercelVersion" -ForegroundColor Green
} catch {
    Write-Host "Vercel CLI nao encontrado. Instalando..." -ForegroundColor Red
    npm install -g vercel
}

# 2. Fazer login no Vercel
Write-Host "Fazendo login no Vercel..." -ForegroundColor Yellow
vercel login

# 3. Deploy do projeto
Write-Host "Iniciando deploy..." -ForegroundColor Yellow
vercel --prod

# 4. Mostrar próximos passos
Write-Host "DEPLOY CONCLUIDO!" -ForegroundColor Green
Write-Host "Proximos passos:" -ForegroundColor Cyan
Write-Host "1. Configure as variaveis de ambiente no Vercel:" -ForegroundColor White
Write-Host "   - DATABASE_URL" -ForegroundColor Gray
Write-Host "   - NEXTAUTH_URL" -ForegroundColor Gray
Write-Host "   - NEXTAUTH_SECRET" -ForegroundColor Gray
Write-Host "   - GOOGLE_CLIENT_ID" -ForegroundColor Gray
Write-Host "   - GOOGLE_CLIENT_SECRET" -ForegroundColor Gray
Write-Host "   - JWT_SECRET" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Configure banco PostgreSQL (Supabase recomendado)" -ForegroundColor White
Write-Host "3. Atualize URLs do Google OAuth" -ForegroundColor White

# 5. Abrir dashboard do Vercel
Write-Host "Abrindo dashboard do Vercel..." -ForegroundColor Yellow
Start-Process "https://vercel.com/dashboard"

Write-Host "Pronto! Siga os passos acima para finalizar." -ForegroundColor Green
