#!/usr/bin/env bash
set -eu
export VAULT_ADDR=https://vault.dide.ic.ac.uk:8200
vault login -method=github
mkdir -p ssl
function clearssl() {
  rm -rf ssl
}
trap clearssl EXIT

vault read -field=certificate /secret/mint/ssl > ssl/certificate.pem
vault read -field=key /secret/mint/ssl > ssl/key.pem
docker pull reside/proxy-nginx:master

docker run -d \
       -p 80:80 -p 443:443 \
       --name=mint-proxy \
       --network=mint_nw \
       reside/proxy-nginx:master \
       mint:8080 mint.dide.ic.ac.uk 80 443

docker cp ssl/certificate.pem mint-proxy:/run/proxy/certificate.pem
docker cp ssl/key.pem mint-proxy:/run/proxy/key.pem

vault write /secret/mint/ssl certificate=@certificate.pem key=@key.pem
