# Script para configurar banco de dados automaticamente
Write-Host "🗄️ Configurando banco de dados..." -ForegroundColor Green

# Opções de banco
Write-Host "Escolha uma opção de banco de dados:" -ForegroundColor Yellow
Write-Host "1. Supabase (Recomendado - Gratuito)" -ForegroundColor White
Write-Host "2. Neon (Alternativa)" -ForegroundColor White
Write-Host "3. Railway" -ForegroundColor White
Write-Host "4. Configuração manual" -ForegroundColor White

$choice = Read-Host "Digite sua escolha (1-4)"

switch ($choice) {
    "1" {
        Write-Host "🚀 Configurando Supabase..." -ForegroundColor Green
        Write-Host "1. Acesse: https://supabase.com" -ForegroundColor Cyan
        Write-Host "2. Crie uma conta e novo projeto" -ForegroundColor Cyan
        Write-Host "3. Vá em Settings → Database" -ForegroundColor Cyan
        Write-Host "4. Copie a Connection String" -ForegroundColor Cyan
        Write-Host "5. Cole no Vercel como DATABASE_URL" -ForegroundColor Cyan
        
        # Abrir Supabase no navegador
        Start-Process "https://supabase.com"
    }
    "2" {
        Write-Host "🚀 Configurando Neon..." -ForegroundColor Green
        Write-Host "1. Acesse: https://neon.tech" -ForegroundColor Cyan
        Write-Host "2. Crie uma conta e novo projeto" -ForegroundColor Cyan
        Write-Host "3. Copie a Connection String" -ForegroundColor Cyan
        Write-Host "4. Cole no Vercel como DATABASE_URL" -ForegroundColor Cyan
        
        # Abrir Neon no navegador
        Start-Process "https://neon.tech"
    }
    "3" {
        Write-Host "🚀 Configurando Railway..." -ForegroundColor Green
        Write-Host "1. Acesse: https://railway.app" -ForegroundColor Cyan
        Write-Host "2. Crie uma conta e novo projeto PostgreSQL" -ForegroundColor Cyan
        Write-Host "3. Copie a Connection String" -ForegroundColor Cyan
        Write-Host "4. Cole no Vercel como DATABASE_URL" -ForegroundColor Cyan
        
        # Abrir Railway no navegador
        Start-Process "https://railway.app"
    }
    "4" {
        Write-Host "📋 Configuração Manual:" -ForegroundColor Yellow
        Write-Host "DATABASE_URL=postgresql://username:password@host:5432/database" -ForegroundColor White
    }
    default {
        Write-Host "❌ Opção inválida!" -ForegroundColor Red
    }
}

Write-Host "✅ Configuração de banco iniciada!" -ForegroundColor Green
