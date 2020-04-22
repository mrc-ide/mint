#!/usr/bin/env bash
set -ex

HERE=$(dirname $0)
. $HERE/common

docker push $TAG_SHA \
    && docker push $TAG_BRANCH

if [ $GIT_BRANCH == "master" ]; then
    docker tag $TAG_SHA $TAG_LATEST
    docker push $TAG_LATEST
fi
