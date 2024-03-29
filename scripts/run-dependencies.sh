#!/usr/bin/env bash
set -ex

docker network prune -f

HERE=$(realpath "$(dirname $0)")

NETWORK=mint_nw
API=mintr
MINTR_VERSION=$(<$HERE/../src/config/mintr_version)

ORG=mrcide
MINTR_IMAGE=$ORG/$API:$MINTR_VERSION

docker network create $NETWORK
docker pull $MINTR_IMAGE

docker run --rm -d \
  --network=$NETWORK \
  --name=$API \
  -v $HERE/../testdata/emulator:/emulator \
  -p 8888:8888 $MINTR_IMAGE --emulator=/emulator
