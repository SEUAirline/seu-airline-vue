# SEUAirline 前端启动脚本
# 用途：检查环境并启动前端服务（连接真实后端）

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  SEUAirline 前端服务启动脚本" -ForegroundColor Cyan
Write-Host "  模式：连接真实后端 API" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 1. 检查 Node.js 环境
Write-Host "[1/3] 检查 Node.js 环境..." -ForegroundColor Yellow
try {
    $nodeVersion = node -v
    Write-Host "  ✅ Node.js $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "  ❌ 未找到 Node.js，请安装 Node.js 16+" -ForegroundColor Red
    exit 1
}

# 2. 检查环境配置
Write-Host ""
Write-Host "[2/3] 检查环境配置..." -ForegroundColor Yellow
$envFile = ".env.development"
if (Test-Path $envFile) {
    $mockSetting = Get-Content $envFile | Select-String "VITE_USE_MOCK"
    if ($mockSetting -match "false") {
        Write-Host "  ✅ Mock 已关闭，将连接真实后端" -ForegroundColor Green
    } else {
        Write-Host "  ⚠️  Mock 仍然开启" -ForegroundColor Yellow
        Write-Host "  建议修改 .env.development: VITE_USE_MOCK=false" -ForegroundColor Yellow
    }
} else {
    Write-Host "  ⚠️  未找到 .env.development 文件" -ForegroundColor Yellow
}

# 3. 检查后端服务
Write-Host ""
Write-Host "[3/3] 检查后端服务..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8080/api/airport/list" -TimeoutSec 2 -ErrorAction Stop
    Write-Host "  ✅ 后端服务正在运行" -ForegroundColor Green
} catch {
    Write-Host "  ⚠️  无法连接到后端服务 (http://localhost:8080)" -ForegroundColor Red
    Write-Host "  请先启动后端服务！" -ForegroundColor Yellow
    Write-Host ""
    $response = Read-Host "  是否继续启动前端？(y/n)"
    if ($response -ne "y") {
        exit 1
    }
}

# 启动前端服务
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  启动前端开发服务器..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

npm run dev
