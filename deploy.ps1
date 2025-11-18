# Script de Despliegue para Gym CH-Club
# Ejecutar desde PowerShell en el directorio del proyecto

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "  DESPLIEGUE GYM CH-CLUB" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Paso 1: Verificar si Git está inicializado
if (-not (Test-Path ".git")) {
    Write-Host "⚙️  Inicializando Git..." -ForegroundColor Yellow
    git init
    git branch -M main
} else {
    Write-Host "✅ Git ya está inicializado" -ForegroundColor Green
}

# Paso 2: Agregar todos los archivos
Write-Host "📦 Agregando archivos..." -ForegroundColor Yellow
git add .

# Paso 3: Commit
$commitMessage = Read-Host "Ingresa un mensaje para el commit (Enter para 'Deploy inicial')"
if ([string]::IsNullOrWhiteSpace($commitMessage)) {
    $commitMessage = "Deploy inicial para producción"
}

git commit -m $commitMessage

# Paso 4: Preguntar si ya tiene repositorio en GitHub
Write-Host ""
$hasRepo = Read-Host "¿Ya creaste un repositorio en GitHub? (s/n)"

if ($hasRepo -eq "n") {
    Write-Host ""
    Write-Host "📝 INSTRUCCIONES:" -ForegroundColor Cyan
    Write-Host "1. Ve a https://github.com/new"
    Write-Host "2. Nombre del repositorio: gym-ch-club"
    Write-Host "3. Déjalo público o privado (recomendado: privado)"
    Write-Host "4. NO agregues README, .gitignore ni licencia"
    Write-Host "5. Click en 'Create repository'"
    Write-Host ""
    Read-Host "Presiona Enter cuando hayas creado el repositorio"
}

# Paso 5: Agregar remote
Write-Host ""
$username = Read-Host "Ingresa tu usuario de GitHub"
$repoUrl = "https://github.com/$username/gym-ch-club.git"

Write-Host "🔗 Configurando remote..." -ForegroundColor Yellow
git remote remove origin 2>$null
git remote add origin $repoUrl

# Paso 6: Push
Write-Host "🚀 Subiendo código a GitHub..." -ForegroundColor Yellow
git push -u origin main

Write-Host ""
Write-Host "✅ ¡Código subido exitosamente!" -ForegroundColor Green
Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "  SIGUIENTE PASO: VERCEL" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Ahora despliega en Vercel:" -ForegroundColor Yellow
Write-Host "1. Ve a https://vercel.com"
Write-Host "2. Inicia sesión con GitHub"
Write-Host "3. Click en 'Add New Project'"
Write-Host "4. Selecciona 'gym-ch-club'"
Write-Host "5. En 'Project Name' escribe: gym-ch-club"
Write-Host "6. En 'Environment Variables' agrega:"
Write-Host "   MONGODB_URI = mongodb+srv://Mariana_Gutierrez:CHClub123@clusterch.bv1is0b.mongodb.net/?appName=ClusterCH" -ForegroundColor Cyan
Write-Host "7. Click en 'Deploy'"
Write-Host ""
Write-Host "Tu sitio estará en: https://gym-ch-club.vercel.app" -ForegroundColor Green
Write-Host ""
