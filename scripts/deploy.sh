#!/usr/bin/env bash
set -ex
echo "Clearing docker"
./scripts/clear-docker.sh
echo "Starting app"
./scripts/pull-and-run.sh
echo "Starting proxy"
./scripts/proxy.sh
