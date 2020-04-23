#!/usr/bin/env bash
set -ex

docker network prune -f

HERE=$(readlink -f "$(dirname $0)")

NETWORK=mint_nw
API=mintr
MINTR_VERSION=$(<$HERE/../src/config/mintr_version)

REGISTRY=mrcide
MINTR_IMAGE=$REGISTRY/$API:$MINTR_VERSION

docker network create $NETWORK
docker pull $MINTR_IMAGE

docker run --rm -d \
  --network=$NETWORK \
  --name=$API \
  -p 8888:8888 $MINTR_IMAGE
