# PulseWatch - Pure Docker Runner (No Docker Compose Required)
Param(
    [string]$Action = "up"
)

$NetworkName = "pulsewatch_net"
$PostgresContainer = "pulsewatch-postgres"
$RedisContainer = "pulsewatch-redis"
$BackendContainer = "pulsewatch-backend"
$FrontendContainer = "pulsewatch-frontend"

if ($Action -eq "down" -or $Action -eq "stop") {
    Write-Host "Stopping and removing PulseWatch containers..." -ForegroundColor Yellow
    docker stop $FrontendContainer $BackendContainer $RedisContainer $PostgresContainer 2>$null
    docker rm $FrontendContainer $BackendContainer $RedisContainer $PostgresContainer 2>$null
    Write-Host "All containers stopped." -ForegroundColor Green
    exit 0
}

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host " Starting PulseWatch with Docker CLI      " -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# 1. Create Docker Network if not exists
$netExists = docker network ls --filter name=^${NetworkName}$ --format "{{.Name}}"
if (-not $netExists) {
    Write-Host "[1/5] Creating network $NetworkName..." -ForegroundColor Gray
    docker network create $NetworkName
} else {
    Write-Host "[1/5] Network $NetworkName already exists." -ForegroundColor Gray
}

# 2. Start PostgreSQL
$pgRunning = docker ps -q --filter name=^${PostgresContainer}$
if (-not $pgRunning) {
    docker rm $PostgresContainer 2>$null
    Write-Host "[2/5] Starting PostgreSQL 16..." -ForegroundColor Gray
    docker run -d `
        --name $PostgresContainer `
        --network $NetworkName `
        -p 5432:5432 `
        -e POSTGRES_DB=pulsewatch_db `
        -e POSTGRES_USER=postgres `
        -e POSTGRES_PASSWORD=postgres `
        -v pulsewatch_pgdata:/var/lib/postgresql/data `
        postgres:16-alpine
} else {
    Write-Host "[2/5] PostgreSQL is already running." -ForegroundColor Gray
}

# 3. Start Redis
$redisRunning = docker ps -q --filter name=^${RedisContainer}$
if (-not $redisRunning) {
    docker rm $RedisContainer 2>$null
    Write-Host "[3/5] Starting Redis 7..." -ForegroundColor Gray
    docker run -d `
        --name $RedisContainer `
        --network $NetworkName `
        -p 6379:6379 `
        redis:7-alpine
} else {
    Write-Host "[3/5] Redis is already running." -ForegroundColor Gray
}

# Wait 3 seconds for Postgres to be ready
Start-Sleep -Seconds 3

# 4. Build and Start Backend
docker rm -f $BackendContainer 2>$null
Write-Host "[4/5] Building and starting Backend (Spring Boot 3 + Java 17)..." -ForegroundColor Gray
docker build -t pulsewatch-backend ./backend
docker run -d `
    --name $BackendContainer `
    --network $NetworkName `
    -p 8080:8080 `
    --env-file .env `
    -e SPRING_DATASOURCE_URL="jdbc:postgresql://${PostgresContainer}:5432/pulsewatch_db" `
    -e SPRING_DATASOURCE_USERNAME="postgres" `
    -e SPRING_DATASOURCE_PASSWORD="postgres" `
    -e REDIS_HOST="${RedisContainer}" `
    -e REDIS_PORT=6379 `
    pulsewatch-backend

# 5. Build and Start Frontend
docker rm -f $FrontendContainer 2>$null
Write-Host "[5/5] Building and starting Frontend (React + Vite + Nginx)..." -ForegroundColor Gray
docker build -t pulsewatch-frontend ./frontend
docker run -d `
    --name $FrontendContainer `
    --network $NetworkName `
    -p 3000:80 `
    --env-file .env `
    pulsewatch-frontend

Write-Host ""
Write-Host "==========================================" -ForegroundColor Green
Write-Host " PulseWatch is running!                   " -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
Write-Host " Web Application : http://localhost:3000" -ForegroundColor White
Write-Host " Backend API     : http://localhost:8080" -ForegroundColor White
Write-Host " Stop Containers : .\docker-run.ps1 stop" -ForegroundColor Gray
Write-Host "==========================================" -ForegroundColor Green
