# Script de Deploy Automatizado - Portal Maginf
Write-Host "🚀 Iniciando deploy automatizado do Portal Maginf..." -ForegroundColor Green

# 1. Verificar se Vercel CLI está instalado
Write-Host "📦 Verificando Vercel CLI..." -ForegroundColor Yellow
try {
    vercel --version
    Write-Host "✅ Vercel CLI encontrado!" -ForegroundColor Green
} catch {
    Write-Host "❌ Vercel CLI não encontrado. Instalando..." -ForegroundColor Red
    npm install -g vercel
}

# 2. Login no Vercel (se necessário)
Write-Host "🔐 Fazendo login no Vercel..." -ForegroundColor Yellow
vercel login

# 3. Deploy do projeto
Write-Host "🚀 Fazendo deploy no Vercel..." -ForegroundColor Yellow
vercel --prod

Write-Host "✅ Deploy concluído!" -ForegroundColor Green
Write-Host "📋 Próximos passos:" -ForegroundColor Cyan
Write-Host "1. Configure as variáveis de ambiente no dashboard do Vercel" -ForegroundColor White
Write-Host "2. Configure o banco PostgreSQL (Supabase recomendado)" -ForegroundColor White
Write-Host "3. Atualize as URLs do Google OAuth" -ForegroundColor White
