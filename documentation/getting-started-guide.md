# AML System — Getting Started Guide (Windows + Docker)

## Prerequisites

Before starting, ensure you have:
- Docker Desktop installed and running
- Node.js 20+ installed
- PowerShell (default on Windows)
- Dapr CLI installed (optional for local dev)

---

## Quick Start (All Steps)

### Infrastructure Setup

#### 1. Start Infrastructure Containers

Start Redis, Zipkin, Dapr placement, and dashboard:

```powershell
cd c:\_LEARNING\aml-system
docker-compose up -d
```

Verify running:
```powershell
docker ps
```

You should see:
- `redis`
- `zipkin`
- `dapr-placement`
- `dapr-dashboard`

Access Dapr Dashboard: http://localhost:8080

---

#### 2. Start Temporal Server (Optional - for workflow orchestration)

Install Temporal CLI:
```powershell
npm install -g @temporalio/cli
```

Start Temporal dev server in a separate terminal:
```powershell
temporal server start-dev
```

Access Temporal UI: http://localhost:8233

---

## Application Flow Steps

### STEP 1 — Build & Run API Gateway

The API Gateway accepts file uploads and publishes events to Dapr.

#### Build the image:
```powershell
cd api-gateway
docker build -t api-gateway .
```

#### Option A: Run standalone (without Dapr sidecar):
```powershell
docker run -p 3000:3000 --name api-gateway --network aml-system_default api-gateway
```

#### Option B: Run locally with Dapr sidecar (recommended for development):
```powershell
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Run with Dapr
dapr run --app-id api-gateway --app-port 3000 --dapr-http-port 3500 --components-path ../dapr/components -- npm start
```

**Test it:**
```powershell
# Health check
curl http://localhost:3000/health

# Upload a test file
curl -X POST http://localhost:3000/upload -F "file=@test.csv"
```

---

### STEP 2 — Run Temporal Worker

The Temporal Worker listens for file-upload events and starts the AML workflow.

```powershell
cd temporal-worker
npm install
dapr run --app-id temporal-worker --app-port 3001 --dapr-http-port 3501 --components-path ../dapr/components -- npm start
```

**What it does:**
- Subscribes to `aml.file.uploaded` topic via Dapr
- Starts `AMLWorkflow` in Temporal
- Coordinates parsing and microservices

---

### STEP 3 — Run Camel Routes

Camel parses uploaded files and splits them into individual transactions.

#### Build and run:
```powershell
cd camel-routes
docker build -t camel-routes .
docker run --name camel-routes --network aml-system_default camel-routes
```

**What it does:**
- Parses CSV/Excel/JSON files
- Splits into individual transactions
- Publishes `aml.tx` events to Dapr

---

### STEP 4 — Start AML Microservices

Each microservice handles a specific AML check.

#### Run each service (in separate terminals or as Docker containers):

**Normalizer:**
```powershell
cd services/normalizer
npm install
dapr run --app-id normalizer --app-port 3002 --dapr-http-port 3502 --components-path ../../dapr/components -- npm start
```

**Sanctions:**
```powershell
cd services/sanctions
npm install
dapr run --app-id sanctions --app-port 3003 --dapr-http-port 3503 --components-path ../../dapr/components -- npm start
```

**KYC:**
```powershell
cd services/kyc
npm install
dapr run --app-id kyc --app-port 3004 --dapr-http-port 3504 --components-path ../../dapr/components -- npm start
```

**Rules:**
```powershell
cd services/rules
npm install
dapr run --app-id rules --app-port 3005 --dapr-http-port 3505 --components-path ../../dapr/components -- npm start
```

**ML (optional):**
```powershell
cd services/ml
npm install
dapr run --app-id ml --app-port 3006 --dapr-http-port 3506 --components-path ../../dapr/components -- npm start
```

---

### STEP 5 — Verify Pub/Sub Events Flow

Monitor logs to see events flowing through the system:

**Check Dapr Dashboard:**
http://localhost:8080

**Check Redis for messages:**
```powershell
docker exec -it redis redis-cli
> KEYS *
> GET <key-name>
```

**Check service logs:**
```powershell
# View Docker container logs
docker logs -f api-gateway
docker logs -f camel-routes
```

---

### STEP 6 — Database Setup & Results Storage

#### Set up Oracle Database (if using Oracle):

**Option A: Oracle in Docker:**
```powershell
docker run -d --name oracle-xe -p 1521:1521 -e ORACLE_PASSWORD=password container-registry.oracle.com/database/express:latest
```

**Option B: Use existing Oracle instance**

#### Run database schema:
```powershell
# Connect to Oracle and run schema files
sqlplus user/password@localhost:1521/XEPDB1 @database/schema/aml_transactions.sql
sqlplus user/password@localhost:1521/XEPDB1 @database/schema/aml_results.sql
sqlplus user/password@localhost:1521/XEPDB1 @database/schema/aml_audit.sql
sqlplus user/password@localhost:1521/XEPDB1 @database/stored-procedures/sp_insert_result.sql
```

#### What happens:
- Temporal aggregates results from all services
- Calls stored procedure or inserts directly
- Writes final AML decisions to `AML_RESULTS` table

---

## Post Processing & Ops

### STEP 7 — Notifications & Callbacks

- Temporal workflow completes
- API Gateway receives callback
- Notification sent to client/user

### STEP 8 — Archival & Audit

- Raw files stored in uploads folder (or S3 if configured)
- Audit logs written to `AML_AUDIT` table

### STEP 9 — Monitoring & Observability

**Zipkin (Distributed Tracing):**
http://localhost:9411

**Dapr Dashboard:**
http://localhost:8080

**Temporal UI:**
http://localhost:8233

**Service Health Checks:**
```powershell
curl http://localhost:3000/health  # API Gateway
curl http://localhost:3002/health  # Normalizer
curl http://localhost:3003/health  # Sanctions
# etc...
```

### STEP 10 — Cleanup

**Stop all services:**
```powershell
# Stop Docker Compose infrastructure
docker-compose down

# Stop individual containers
docker stop api-gateway camel-routes oracle-xe
docker rm api-gateway camel-routes oracle-xe

# Stop Dapr sidecars (if running locally)
# Just Ctrl+C in each terminal
```

---

## Validation Checklist

- [ ] Infrastructure running: `docker ps` shows Redis, Zipkin, placement, dashboard
- [ ] API Gateway responds: `curl http://localhost:3000/health`
- [ ] Dapr dashboard accessible: http://localhost:8080
- [ ] File upload works: `curl -X POST http://localhost:3000/upload -F "file=@test.csv"`
- [ ] Events published to Redis (check Dapr dashboard or Redis CLI)
- [ ] Microservices running and healthy
- [ ] Temporal UI accessible: http://localhost:8233
- [ ] Database schema created and accessible
- [ ] Results inserted: `SELECT * FROM AML_RESULTS;`

---

## Troubleshooting

### Port conflicts:
```powershell
# Check what's using a port
netstat -ano | findstr :3000
```

### Container won't start:
```powershell
# Check logs
docker logs <container-name>

# Remove and rebuild
docker rm <container-name>
docker build -t <image-name> .
```

### Dapr sidecar issues:
```powershell
# Reinitialize Dapr
dapr uninstall
dapr init
```

### Redis connection issues:
```powershell
# Check Redis is running
docker ps | findstr redis

# Test connection
docker exec -it redis redis-cli ping
```
