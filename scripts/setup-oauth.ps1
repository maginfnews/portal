# Script para configurar Google OAuth automaticamente
Write-Host "🔐 Configurando Google OAuth..." -ForegroundColor Green

# Abrir Google Cloud Console
Write-Host "1. Abrindo Google Cloud Console..." -ForegroundColor Yellow
Start-Process "https://console.cloud.google.com/apis/credentials"

Write-Host "📋 Siga estes passos:" -ForegroundColor Cyan
Write-Host "1. Selecione o projeto 'portal-maginf'" -ForegroundColor White
Write-Host "2. Clique no OAuth 2.0 Client ID existente" -ForegroundColor White
Write-Host "3. Adicione as URLs do Vercel:" -ForegroundColor White

# Ler URL do Vercel
$vercelUrl = Read-Host "Digite a URL do seu projeto Vercel (ex: https://portal-maginf.vercel.app)"

if ($vercelUrl) {
    Write-Host "📝 Adicione estas URLs no Google Cloud Console:" -ForegroundColor Yellow
    Write-Host "Authorized JavaScript origins:" -ForegroundColor Cyan
    Write-Host "- $vercelUrl" -ForegroundColor White
    Write-Host ""
    Write-Host "Authorized redirect URIs:" -ForegroundColor Cyan
    Write-Host "- $vercelUrl/api/auth/callback/google" -ForegroundColor White
    
    # Copiar para clipboard
    $oauthConfig = @"
Authorized JavaScript origins:
$vercelUrl

Authorized redirect URIs:
$vercelUrl/api/auth/callback/google
"@
    
    $oauthConfig | Set-Clipboard
    Write-Host "✅ URLs copiadas para a área de transferência!" -ForegroundColor Green
}

Write-Host "Suas credenciais OAuth:" -ForegroundColor Yellow
Write-Host "GOOGLE_CLIENT_ID=seu-google-client-id.apps.googleusercontent.com" -ForegroundColor White
Write-Host "GOOGLE_CLIENT_SECRET=GOCSPX-seu-google-client-secret" -ForegroundColor White

Write-Host "✅ Configuração OAuth iniciada!" -ForegroundColor Green
