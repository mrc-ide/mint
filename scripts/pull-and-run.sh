#!/usr/bin/env bash
set -ex

HERE=$(readlink -f "$(dirname $0)")
NETWORK=mint_nw
MINT=mint
$HERE/run-dependencies.sh

. $HERE/common # sets GIT_BRANCH

TEST_CONFIG=$HERE/../src/app/static/scripts/test.properties
MINT_IMAGE=mrcide/$MINT:$GIT_BRANCH

docker pull $MINT_IMAGE

docker run --rm -d \
  --network=$NETWORK \
  --name $MINT \
  -p 8080:8080 \
  $MINT_IMAGE

docker cp $TEST_CONFIG $MINT:/etc/mint/config.properties