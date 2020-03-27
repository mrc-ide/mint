#!/usr/bin/env bash
set -ex

# Do not run if this is a pull request build - don't want to push to master yet
if [ $TRAVIS_PULL_REQUEST != "false" ]; then
   exit 0
fi

# TODO: Docker build and push