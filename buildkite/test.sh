#!/usr/bin/env bash
set -e
HERE=$(realpath "$(dirname $0)")
. $HERE/common

trap cleardocker EXIT

# Create an image based on the shared build env that runs back-end tests
docker build --tag=mint-test \
  --build-arg GIT_ID=$GIT_ID \
  -f $HERE/test.dockerfile \
  .

$HERE/../scripts/run-dependencies.sh

# Ensure that mintr is available
for _ in $(seq 30); do
    if [[ "$(curl --silent http://localhost:8888)" == *"Welcome to mintr"* ]]; then
        break
    fi
    sleep 6
done

# Run the build env image to run gradle tests
docker run --rm \
    -v /var/run/docker.sock:/var/run/docker.sock \
    --network=$NETWORK \
    mint-test
