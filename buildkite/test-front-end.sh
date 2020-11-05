#!/usr/bin/env bash
set -ex
HERE=$(dirname $0)
. $HERE/common

function cleardocker() {
  $HERE/../scripts/clear-docker.sh
}
trap cleardocker EXIT

# Run all dependencies
$HERE/run-dependencies-for-integration-tests.sh

# Create an image based on the shared build env that compiles and tests the front-end
docker build --tag mint-test \
	--build-arg GIT_ID=$GIT_ID \
  -f $HERE/test-front-end.dockerfile \
	.

# Run the created image
docker run --rm \
    --network=mint_nw \
    mint-test
