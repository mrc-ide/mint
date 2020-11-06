#!/usr/bin/env bash
set -e
HERE=$(realpath "$(dirname $0)")
. $HERE/common

function cleardocker() {
  $HERE/../scripts/clear-docker.sh
}
trap cleardocker EXIT

# Create an image based on the shared build env that runs back-end tests
docker build --tag=mint-test \
  --build-arg GIT_ID=$GIT_ID \
  -f $HERE/test.dockerfile \
  .

$HERE/../scripts/run-dependencies.sh

# Run the build env image to run gradle tests
docker run --rm \
    -v /var/run/docker.sock:/var/run/docker.sock \
    --network=mint_nw \
    mint-test
