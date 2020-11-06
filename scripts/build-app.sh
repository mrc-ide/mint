#!/usr/bin/env bash
set -ex

HERE=$(readlink -f "$(dirname $0)")
. $HERE/common

export NODE_ENV=production

$HERE/../src/gradlew -p $HERE/../src :app:bootDistTar

( cd $HERE/../src ;
  docker build --build-arg SPRING_PROFILES_ACTIVE=$1 -f ../Dockerfile --tag $TAG_SHA . \
    && docker tag $TAG_SHA $TAG_BRANCH
)
