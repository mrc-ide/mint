'use strict';
// This file is executed by ./generate-types.sh

const schemaToTs = require('json-schema-to-typescript');
const fs = require('fs');
const path = require('path');

const dir = process.argv[2];

fs.readdir(dir, function (err, files) {
    if (err) {
        console.error("Could not list the directory.", err);
        process.exit(1);
    }

    files.forEach(function (file) {
        if (file.endsWith(".json")) {
            const filePath = path.join(dir, file);
            const typeName = file.split(".")[0];
            try {
                schemaToTs.compileFromFile(filePath, {cwd: dir, bannerComment: ""})
                    .then(ts => fs.writeFileSync(`types/${typeName}.d.ts`, ts))
            } catch (e) {
                console.log(e);
            }
        }
    });
});
