## MINT Front End
js and sass source files and tests can be found in `./src`. Compiled files are written to `./public`.

### Generating type definitions
Type definitions are auto-generated based on the 
[pkgapi schema](https://github.com/reside-ic/pkgapi/tree/master/inst/schema) and the
[mintr API schema](https://github.com/mrc-ide/mintr/tree/master/inst/schema). To 
re-generate types run 

    ./scripts/generate-types.sh <BRANCH_NAME>

from this directory

### Testing
Tests are run with jest. Files with the suffix `.test.ts` are treated as unit tests, files 
with the suffix `.itest.ts` treated as integration tests. Config for each can be found in 
`jest.config.js` and `jest.integration.config.js`, respectively.
- run unit tests with `npm test` 
- run integration tests with `npm run integration-test` having first started the app and 
all dependencies by running `./scripts/run-dev-dependencies-for-integration-tests.sh` from this
directory

### Compiling
- sass is compiled using gulp - this task can be triggered by running `npm run sass` 
- js is bundled using webpack - this task can be triggered by running `npm run js`

Or to compile both at once, `npm run build`
