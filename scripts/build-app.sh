#!/usr/bin/env bash
set -ex

HERE=$(readlink -f "$(dirname $0)")
. $HERE/common

export NODE_ENV=production

$HERE/../src/gradlew -p $HERE/../src :app:bootDistTar

docker build --build-arg SPRING_PROFILES_ACTIVE=$1 $HERE/.. --tag $APP_DOCKER_COMMIT_TAG \
    && docker tag $APP_DOCKER_COMMIT_TAG $APP_DOCKER_BRANCH_TAG
