# PREREQUISITES.md

# AML Processing System — Local Development Prerequisites

This document lists all required tools and setup steps to run the **AML System** (Node.js + Oracle + Dapr + Temporal + Apache Camel) on a local machine without Kubernetes.

---

## 1. Operating System Requirements

* **Windows 10/11** (WSL2 recommended)
* **macOS (Intel / M1 / M2)**
* **Linux (Ubuntu recommended)**

---

## 2. Core Runtime Tools

### 2.1 Node.js

* **Node.js 20+**
* **npm** (comes with Node.js)
* Optional: **nvm** for version management

Verify:

```bash
node -v
npm -v
```

### 2.2 Java (for Apache Camel)

* **Java 17 LTS**

Verify:

```bash
java -version
```

### 2.3 Python (optional)

* Python 3.10+ for tooling and utilities

Verify:

```bash
python3 --version
```

---

## 3. Database Requirements

### Oracle Database (Local or Remote)

Used for storing:

* Transactions
* Sanctions Data
* KYC Data
* AML Rules
* Results and Audit Logs

**Options:**

* **Oracle XE (Local)**: [https://www.oracle.com/database/technologies/xe-downloads.html](https://www.oracle.com/database/technologies/xe-downloads.html)
* **Oracle in Docker** (recommended for dev):

```bash
docker pull container-registry.oracle.com/database/express:latest
```

**Node.js Oracle Driver:**

```bash
npm install oracledb
```

---

## 4. Dapr Runtime

Provides pub/sub, state store, service invocation, and secrets.

### Install Dapr CLI

* Windows:

```bash
winget install Dapr.Dapr -s winget
```

* macOS:

```bash
brew install dapr/tap/dapr
```

* Linux:

```bash
wget -q https://raw.githubusercontent.com/dapr/cli/master/install/install.sh -O - | /bin/bash
```

### Initialize Dapr

```bash
dapr init
```

Verify:

```bash
dapr --version
```

---

## 5. Temporal Server

Used for orchestrating long-running workflows.

### Install Temporal CLI

```bash
npm install -g @temporalio/cli
```

### Start Temporal (dev mode)

```bash
temporal server start-dev
```

UI: [http://localhost:8233](http://localhost:8233)

---

## 6. Apache Camel

Used for file ingestion and routing.

### Install Camel Standalone (JBang)

```bash
curl -Ls https://sh.jbang.dev | bash -s - app setup
jbang app install --fresh camel@apache/camel
```

Verify:

```bash
camel --version
```

---

## 7. Oracle Instant Client (Required for Node.js)

* Download: [https://www.oracle.com/database/technologies/instant-client/downloads.html](https://www.oracle.com/database/technologies/instant-client/downloads.html)
* Install `instantclient-basic` and `instantclient-sdk`

**Set environment variables:**

* Windows: Add folder to `PATH`
* macOS:

```bash
export DYLD_LIBRARY_PATH=/opt/oracle/instantclient_21_8
```

* Linux:

```bash
export LD_LIBRARY_PATH=/opt/oracle/instantclient_21_8
```

Verify Node.js driver:

```bash
node -e "require('oracledb'); console.log('Oracle Driver OK')"
```

---

## 8. Optional Tools

* **Docker** → for Oracle, Redis, Camel, microservices
* **VSCode** → recommended extensions: Dapr, Temporal, Docker, Oracle SQL, REST Client
* **Postman / Insomnia** → API testing
* **Git** → version control

---

## 9. Ports Used

| Component            | Port                  |
| -------------------- | --------------------- |
| Dapr HTTP            | 3500                  |
| Dapr gRPC            | 50001                 |
| Temporal Frontend    | 7233                  |
| Temporal UI          | 8233                  |
| Oracle               | 1521                  |
| Redis (State/PubSub) | 6379                  |
| Microservices        | 3000, 3001, 3002, ... |

Ensure these ports are free before starting services.

---

## 10. Verify Environment

```bash
node -v
npm -v
java -version
python3 --version
dapr --version
temporal --version
camel --version
docker -v
```

All commands should return version numbers to confirm readiness.
