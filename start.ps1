param([switch]$NoBackend)

Write-Host "=== Pebble MVP - Starting Full Stack ===" -ForegroundColor Cyan
Write-Host ""

if (-not $NoBackend) {
  Write-Host "[1/2] Starting backend (Python 3.11 + FastAPI)..." -ForegroundColor Yellow
  $backendJob = Start-Job -Name PebbleBackend -ScriptBlock {
    Set-Location "$using:PWD\backend"
    py -3.11 -m uvicorn app.main:app --host 127.0.0.1 --port 8080 --reload
  }
  Start-Sleep -Seconds 4
  try {
    $r = Invoke-WebRequest -Uri "http://127.0.0.1:8080/" -UseBasicParsing -TimeoutSec 3
    Write-Host "  OK: Backend running on http://localhost:8080" -ForegroundColor Green
  } catch {
    Write-Host "  WARNING: Backend not reachable. Frontend will use mock mode." -ForegroundColor Yellow
  }
} else {
  Write-Host "[1/2] Backend skipped (using mock mode)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "[2/2] Starting frontend..." -ForegroundColor Yellow
$frontendProcess = Start-Process -NoNewWindow -FilePath "npm" -ArgumentList "run", "dev" -WorkingDirectory "$PWD\frontend" -PassThru

Write-Host ""
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host " Pebble is ready!" -ForegroundColor Cyan
Write-Host " Frontend: http://localhost:5173" -ForegroundColor Green
if (-not $NoBackend) {
  Write-Host " Backend:  http://localhost:8080" -ForegroundColor Green
} else {
  Write-Host " Backend:  MOCK MODE (standalone)" -ForegroundColor Yellow
}
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop everything" -ForegroundColor Gray

try {
  while ($true) { Start-Sleep -Seconds 10 }
} finally {
  if ($backendJob) { Stop-Job $backendJob -ErrorAction SilentlyContinue }
  if ($frontendProcess) { Stop-Process $frontendProcess -Force -ErrorAction SilentlyContinue }
}
