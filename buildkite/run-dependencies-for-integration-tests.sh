#!/usr/bin/env bash
set -ex
HERE=$(realpath "$(dirname $0)")
. $HERE/common

TEST_CONFIG=$HERE/../src/app/static/test.properties

$HERE/../scripts/run-dependencies.sh

# Build and run docker image of app
$HERE/build.sh node
docker run --rm -d \
  --network=$NETWORK \
  --name mint \
  -p 8080:8080 \
  node
