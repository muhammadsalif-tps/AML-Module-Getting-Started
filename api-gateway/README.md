# How to Run API Gateway with Dapr

## Prerequisites
- Docker Desktop running
- Redis container running (from docker-compose.yml)
- Node.js installed locally

## Option 1: Run with Docker Compose (Recommended)

1. Start infrastructure services:
```powershell
docker-compose up -d
```

2. Build and run API Gateway:
```powershell
cd api-gateway
docker build -t api-gateway .
docker run -p 3000:3000 --name api-gateway --network aml-system_default api-gateway
```

## Option 2: Run Locally with Dapr Sidecar

1. Install Dapr CLI:
```powershell
powershell -Command "iwr -useb https://raw.githubusercontent.com/dapr/cli/master/install/install.ps1 | iex"
```

2. Initialize Dapr:
```powershell
dapr init
```

3. Install dependencies:
```powershell
cd api-gateway
npm install
```

4. Create .env file from .env.example:
```powershell
cp .env.example .env
```

5. Run with Dapr sidecar:
```powershell
dapr run --app-id api-gateway --app-port 3000 --dapr-http-port 3500 --components-path ../dapr/components -- npm start
```

## Test the API

### Health Check
```powershell
curl http://localhost:3000/health
```

### Upload a file
```powershell
curl -X POST http://localhost:3000/upload -F "file=@test.csv"
```

## Verify Dapr Integration

Check Dapr dashboard:
```
http://localhost:8080
```

View published events in logs when you upload a file.
