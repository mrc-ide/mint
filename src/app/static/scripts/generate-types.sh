#!/usr/bin/env bash
set -e

here=$(dirname $0)

echo "Usage: ./generate-types.sh MINTR_BRANCH"
target="src/app/generated.d.ts"
mintr_version=$(<$here/../../../config/mintr_version)
if [[ $# -ne 1 ]] ; then
    echo "No branch provided. Defaulting to $mintr_version"
    branch=$mintr_version
else
    branch=$1
fi

wget https://github.com/mrc-ide/mintr/archive/${branch}.zip
unzip ${branch}
rm ${branch}.zip

wget https://github.com/reside-ic/pkgapi/archive/master.zip
unzip master
rm master.zip

rm ${target} -f
mkdir types

node generateTypes "mintr-${branch}/inst/schema"
node generateTypes "pkgapi-master/inst/schema"

echo "/**
  * This file was automatically generated.
  * DO NOT MODIFY IT BY HAND.
  * Instead, modify the hintr JSON schema files
  * and run ./generate-types.sh to regenerate this file.
*/" >> ${target}

cat types/*.d.ts >> ${target}
rm types -rf
rm mintr-${branch} -r
rm pkgapi-master -r