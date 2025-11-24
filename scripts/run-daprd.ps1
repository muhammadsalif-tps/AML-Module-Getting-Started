# PowerShell script to run Dapr sidecar in Docker
# Usage: .\run-daprd.ps1 <app-id> <app-port> <dapr-http-port> <dapr-grpc-port>
# Example: .\run-daprd.ps1 sanctions 3002 3501 50002

param(
    [Parameter(Mandatory=$true)]
    [string]$AppId,
    
    [Parameter(Mandatory=$true)]
    [int]$AppPort,
    
    [Parameter(Mandatory=$true)]
    [int]$DaprHttpPort,
    
    [Parameter(Mandatory=$true)]
    [int]$DaprGrpcPort
)

$ComponentsPath = "$PSScriptRoot\..\dapr\components"

Write-Host "Starting Dapr sidecar for $AppId..." -ForegroundColor Green
Write-Host "  App Port: $AppPort" -ForegroundColor Cyan
Write-Host "  Dapr HTTP Port: $DaprHttpPort" -ForegroundColor Cyan
Write-Host "  Dapr gRPC Port: $DaprGrpcPort" -ForegroundColor Cyan

docker run -d --name "dapr-$AppId" `
  --network aml-system_default `
  -v "${ComponentsPath}:/components" `
  -p "${DaprHttpPort}:${DaprHttpPort}" `
  -p "${DaprGrpcPort}:${DaprGrpcPort}" `
  daprio/daprd:latest `
  ./daprd `
    --app-id $AppId `
    --app-port $AppPort `
    --dapr-http-port $DaprHttpPort `
    --dapr-grpc-port $DaprGrpcPort `
    --components-path /components `
    --placement-host-address dapr-placement:50005

Write-Host "Dapr sidecar 'dapr-$AppId' started successfully!" -ForegroundColor Green
Write-Host "Check status: docker ps | findstr dapr-$AppId" -ForegroundColor Yellow
