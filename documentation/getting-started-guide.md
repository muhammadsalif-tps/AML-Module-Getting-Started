# AML System --- Run & Deployment Checklist (Local, WSL2 + Docker)

## Infrastructure Setup

1.  Start infra containers
    -   `docker compose up -d`\
    -   (Creates Redis, Zipkin, Dapr placement, dashboard)
2.  Start Dapr sidecars (one per service)
    -   Use:
        `scripts/run-daprd.sh <app-id> <app-port> <dapr-http> <dapr-grpc>`\
    -   Example: `./scripts/run-daprd.sh sanctions 3002 3501 50002`

------------------------------------------------------------------------

## Application Flow Steps

### STEP 1 --- Build & Run API Gateway

-   Accept file upload\
-   Save file (MinIO / local)\
-   Publish `aml.file.uploaded` to Dapr PubSub

### STEP 2 --- Run Temporal Worker

-   Listens for file-upload event\
-   Starts `AMLWorkflow`\
-   Coordinates parsing and microservices

### STEP 3 --- Run Camel Routes

-   Parse uploaded file (CSV/Excel/JSON)\
-   Split into individual transactions\
-   Publish `aml.tx` events

### STEP 4 --- Start AML Microservices

-   Normalizer\
-   Sanctions\
-   KYC\
-   Rules\
-   ML (optional)\
    Each subscribes to Dapr PubSub or invoked by Temporal.

### STEP 5 --- Confirm Pub/Sub Events Flow

-   Use logs, Redis keys, Dapr dashboard\
-   Verify publish and subscribe activity

### STEP 6 --- Insert Results Into Oracle

-   Temporal aggregates results\
-   Calls stored procedure or inserts\
-   Writes final AML decisions into DB

------------------------------------------------------------------------

## Post Processing & Ops

### STEP 7 --- Notifications & Callbacks

-   API Gateway or Temporal sends completion notification

### STEP 8 --- Archival & Audit

-   Store raw files\
-   Write audit logs to `AML_AUDIT` table

### STEP 9 --- Monitoring & Observability

-   Zipkin traces\
-   Prometheus/Grafana (if configured)\
-   Service logs

### STEP 10 --- Cleanup

-   Stop services: `docker compose down`\
-   Remove sidecars if needed: `docker rm -f dapr-*`

------------------------------------------------------------------------

## Validation Checklist

-   Infra running: `docker ps` shows Redis, Zipkin, placement,
    dashboard\
-   Sidecars running: `docker ps | grep dapr`\
-   Services responding to `/health`\
-   Publish test message works\
-   Oracle inserts visible: `SELECT * FROM AML_RESULTS;`
