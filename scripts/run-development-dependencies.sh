#!/usr/bin/env bash
set -ex

HERE=$(dirname "$0")
NETWORK=mint_nw
API=mintr

"$HERE"/run-dependencies.sh

# From now on, if the user presses Ctrl+C we should teardown gracefully
trap cleanup INT
function cleanup() {
  docker kill $API
  docker network rm $NETWORK
}

# Wait for Ctrl+C
echo "Ready to use. Press Ctrl+C to teardown."
sleep infinity