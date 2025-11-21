aml-system/
│
├── api-gateway/
│   ├── src/
│   │   ├── upload.controller.js
│   │   ├── upload.routes.js
│   │   ├── oracle.js
│   │   ├── server.js
│   │   ├── storage.js
│   │   ├── pubsub.js
│   ├── uploads/   ← auto-created folder for storing uploaded files
│   ├── package.json
│   ├── Dockerfile
│
├── scripts/                  # Dev tools / helpers / startup scripts
│   ├── run-daprd.sh          # Runs Dapr sidecar without CLI
│
├── temporal-worker/
│   ├── src/
│   │   ├── workflows/
│   │   │   └── aml.workflow.js
│   │   ├── activi
│   │   │   ├── startCamelFileParse.js
│   │   │   └── storeResults.js
│   ├── package.json
│   ├── Dockerfile
│
├── camel-routes/
│   ├── routes/
│   │   └── aml-file-parse.xml  (Camel K or standalone XML/Java DSL)
│   ├── Dockerfile
│
├── services/
│   ├── normalizer/
│   ├── sanctions/
│   ├── kyc/
│   ├── rules/
│   ├── ml/
│   │
│   Each service:
│     src/
│       server.js
│       handlers/
│       dapr.js
│       oracle.js
│     package.json
│     Dockerfile
│
├── dapr/
│   ├── components/
│   │   ├── pubsub.yaml
│   │   ├── state.yaml
│   │   ├── secrets.yaml
│   ├── config.yaml
│
├── database/
│   ├── schema/
│   │   ├── aml_transactions.sql
│   │   ├── aml_results.sql
│   │   ├── aml_audit.sql
│   ├── stored-procedures/
│       └── sp_insert_result.sql
│
└── kubernetes/
    ├── api-deployment.yaml
    ├── temporal.yaml
    ├── camel.yaml
    ├── services.yaml
    ├── dapr-components.yaml


Create directories
mkdir aml-system\api-gateway\src\ aml-system\temporal-worker\src\workflows\ aml-system\temporal-worker\src\activities\ aml-system\camel-routes\routes\ aml-system\services\normalizer\src\handlers\ aml-system\services\sanctions\src\handlers\ aml-system\services\kyc\src\handlers\ aml-system\services\rules\src\handlers\ aml-system\services\ml\src\handlers\ aml-system\dapr\components\ aml-system\database\schema\ aml-system\database\stored-procedures\ aml-system\kubernetes & type nul > aml-system\api-gateway\src\upload.controller.js & type nul > aml-system\api-gateway\src\upload.routes.js & type nul > aml-system\api-gateway\src\oracle.js & type nul > aml-system\api-gateway\package.json & type nul > aml-system\api-gateway\Dockerfile & type nul > aml-system\temporal-worker\src\workflows\aml.workflow.js & type nul > aml-system\temporal-worker\src\activities\startCamelFileParse.js & type nul > aml-system\temporal-worker\src\activities\storeResults.js & type nul > aml-system\temporal-worker\package.json & type nul > aml-system\temporal-worker\Dockerfile & type nul > aml-system\camel-routes\routes\aml-file-parse.xml & type nul > aml-system\camel-routes\Dockerfile & type nul > aml-system\dapr\components\pubsub.yaml & type nul > aml-system\dapr\components\state.yaml & type nul > aml-system\dapr\components\secrets.yaml & type nul > aml-system\dapr\config.yaml & type nul > aml-system\database\schema\aml_transactions.sql & type nul > aml-system\database\schema\aml_results.sql & type nul > aml-system\database\schema\aml_audit.sql & type nul > aml-system\database\stored-procedures\sp_insert_result.sql & type nul > aml-system\kubernetes\api-deployment.yaml & type nul > aml-system\kubernetes\temporal.yaml & type nul > aml-system\kubernetes\camel.yaml & type nul > aml-system\kubernetes\services.yaml & type nul > aml-system\kubernetes\dapr-components.yaml & type nul > aml-system\services\normalizer\src\server.js & type nul > aml-system\services\normalizer\src\handlers\dapr.js & type nul > aml-system\services\normalizer\src\handlers\oracle.js & type nul > aml-system\services\normalizer\package.json & type nul > aml-system\services\normalizer\Dockerfile & type nul > aml-system\services\sanctions\src\server.js & type nul > aml-system\services\sanctions\src\handlers\dapr.js & type nul > aml-system\services\sanctions\src\handlers\oracle.js & type nul > aml-system\services\sanctions\package.json & type nul > aml-system\services\sanctions\Dockerfile & type nul > aml-system\services\kyc\src\server.js & type nul > aml-system\services\kyc\src\handlers\dapr.js & type nul > aml-system\services\kyc\src\handlers\oracle.js & type nul > aml-system\services\kyc\package.json & type nul > aml-system\services\kyc\Dockerfile & type nul > aml-system\services\rules\src\server.js & type nul > aml-system\services\rules\src\handlers\dapr.js & type nul > aml-system\services\rules\src\handlers\oracle.js & type nul > aml-system\services\rules\package.json & type nul > aml-system\services\rules\Dockerfile & type nul > aml-system\services\ml\src\server.js & type nul > aml-system\services\ml\src\handlers\dapr.js & type nul > aml-system\services\ml\src\handlers\oracle.js & type nul > aml-system\services\ml\package.json & type nul > aml-system\services\ml\Dockerfile





