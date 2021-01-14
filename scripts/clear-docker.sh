#!/usr/bin/env bash
docker rm --force $(docker ps -aq)
docker network prune --force
exit 0