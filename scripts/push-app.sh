#!/usr/bin/env bash
set -ex

HERE=$(dirname $0)
. $HERE/common

docker push $APP_DOCKER_COMMIT_TAG \
    && docker push $APP_DOCKER_BRANCH_TAG
