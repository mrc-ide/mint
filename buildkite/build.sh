#!/usr/bin/env bash
set -ex
HERE=$(dirname $0)
. $HERE/common

# Optional spring profile argument passed when building a testing image
# If it is passed, also use it as the image tag
if [ -z "$1" ]; then
  TAG=$TAG_SHA
else
  TAG=$1
fi

docker build --tag=$TAG \
  --build-arg GIT_ID=$GIT_ID \
  --build-arg SPRING_PROFILE=$1 \
  -f $HERE/build.dockerfile \
  .

# We push created docker image in a separate script so that this script can be re-used
# to build a local image for front-end integration testing
