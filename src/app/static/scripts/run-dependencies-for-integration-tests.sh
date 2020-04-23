#!/usr/bin/env bash
set -ex

HERE=$(readlink -f "$(dirname $0)")
NETWORK=mint_nw
MINT=mint
$HERE/../../../../scripts/run-dependencies.sh

. $HERE/../../../../scripts/common # sets GIT_BRANCH
$HERE/../../../../scripts/build-app.sh node

TEST_CONFIG=$HERE/test.properties
MINT_IMAGE=mrcide/$MINT:$GIT_BRANCH

docker run --rm -d \
  --network=$NETWORK \
  --name $MINT \
  -p 8080:8080 \
  $MINT_IMAGE
