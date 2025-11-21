#!/bin/bash

APP_ID=$1
APP_PORT=$2
DAPR_HTTP=$3
DAPR_GRPC=$4

docker run -d --name "dapr-$APP_ID" \
  --network host \
  -v $(pwd)/dapr/components:/components \
  daprio/daprd:latest \
  ./daprd \
    --app-id $APP_ID \
    --app-port $APP_PORT \
    --dapr-http-port $DAPR_HTTP \
    --dapr-grpc-port $DAPR_GRPC \
    --components-path /components \
    --config /components/../config.yaml
