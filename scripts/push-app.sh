#!/usr/bin/env bash
set -ex

HERE=$(dirname $0)
. $HERE/common

docker push $APP_DOCKER_COMMIT_TAG \
    && docker push $APP_DOCKER_BRANCH_TAG

if [ $GIT_BRANCH == "master" ]; then
    docker tag $TAG_SHA $TAG_LATEST
    docker push $TAG_LATEST
fi
