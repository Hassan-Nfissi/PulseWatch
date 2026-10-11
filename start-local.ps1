# PulseWatch - Local Runner using installed Microsoft JDK 17 & Node.js
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host " Starting PulseWatch in Local Dev Mode    " -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# Locate JDK 17
$jdkPath = "C:\Program Files\Microsoft\jdk-17.0.15.6-hotspot"
if (-not (Test-Path $jdkPath)) {
    $jdkPath = "C:\Users\hassan nfissi\.jdks\jdk-17.0.2"
}
if (Test-Path $jdkPath) {
    Write-Host "Using JDK 17 from: $jdkPath" -ForegroundColor Green
    $env:JAVA_HOME = $jdkPath
    $env:Path = "$jdkPath\bin;" + $env:Path
} else {
    Write-Host "Warning: Could not locate JDK 17 path. Using system default Java." -ForegroundColor Yellow
}

# Optional: Spin up PostgreSQL in Docker if docker is running
Write-Host "Checking PostgreSQL container..." -ForegroundColor Gray
docker run -d --name pulsewatch-postgres -p 5432:5432 -e POSTGRES_DB=pulsewatch_db -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres postgres:16-alpine 2>$null

Write-Host ""
Write-Host "To run the backend:" -ForegroundColor Yellow
Write-Host "  cd backend" -ForegroundColor White
Write-Host "  mvn spring-boot:run" -ForegroundColor White
Write-Host ""
Write-Host "To run the frontend (in a separate terminal):" -ForegroundColor Yellow
Write-Host "  cd frontend" -ForegroundColor White
Write-Host "  npm run dev" -ForegroundColor White
Write-Host "==========================================" -ForegroundColor Cyan
