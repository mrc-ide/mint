#!/usr/bin/env bash
set -ex
HERE=$(dirname $0)

# Do not run if this is a pull request build - don't want to push to master yet
if [ $TRAVIS_PULL_REQUEST != "false" ]; then
   exit 0
fi

$HERE/build-app.sh
$HERE/push-app.sh
