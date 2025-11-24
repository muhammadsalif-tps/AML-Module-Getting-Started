# Quick Start Commands - Copy/Paste Ready

## 1. Start Infrastructure
```powershell
docker-compose up -d
```

## 2. Start Temporal (in separate terminal)
```powershell
temporal server start-dev
```

## 3. Run API Gateway (Local with Dapr)
```powershell
cd api-gateway
npm install
cp .env.example .env
dapr run --app-id api-gateway --app-port 3000 --dapr-http-port 3500 --components-path ../dapr/components -- npm start
```

## 4. Test API Gateway
```powershell
# Health check
curl http://localhost:3000/health

# Create a test CSV file
echo "transaction_id,amount,sender,receiver`n1,1000,John,Jane" > test.csv

# Upload file
curl -X POST http://localhost:3000/upload -F "file=@test.csv"
```

## 5. Access Dashboards
- Dapr Dashboard: http://localhost:8080
- Temporal UI: http://localhost:8233  
- Zipkin Tracing: http://localhost:9411

## 6. Stop Everything
```powershell
# Stop Temporal (Ctrl+C in its terminal)
# Stop Dapr services (Ctrl+C in each terminal)
docker-compose down
```
