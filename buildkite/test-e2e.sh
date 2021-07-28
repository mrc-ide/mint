#!/usr/bin/env bash
set -ex
HERE=$(dirname $0)
. $HERE/common

function cleardocker() {
  $HERE/../scripts/clear-docker.sh
}
trap cleardocker EXIT

# Run all dependencies
$HERE/../scripts/run-dependencies.sh

# Create an image based on the shared build env that compiles and tests the front-end
docker build --tag mint-test \
	--build-arg GIT_ID=$GIT_ID \
  -f $HERE/test-e2e.dockerfile \
	.

# Run the created image
docker run --rm \
    --network=$NETWORK \
    -v $HERE/../src/app/static/scripts/test.properties:/etc/mint/config.properties \
    mint-test
