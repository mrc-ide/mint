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

There are three kinds of tests:

- Unit tests. These have suffix `.test.ts` and are run with [Jest](https://jestjs.io/) via `npm test` with configuration
  in `jest.config.js`.
- Integration tests. These have suffix `.itest.ts` and are run with Jest via `npm run integration-test` with
  configuration in `jest.integration.config.js`.
- End-to-end (in-browser) tests. These have suffix `.etest.ts` and are run with [Playwright](https://playwright.dev/) via
  `npm run e2e-test` with configuration in `playwright.config.ts`. Run `npx playwright install chromium` to perform a
  one-time installation of the Playwright Chromium binary.
  - Playwright provides [various tools](https://playwright.dev/docs/debug) for authoring and debugging tests. But if
    you've written a failing test then simply running `npm run e2e-test -- --headed` may help identify the issue.

Note that integration and end-to-end tests require the app and all dependencies to already be running, via
`./scripts/run-dev-dependencies-for-integration-tests.sh`.

### Compiling
- sass is compiled using gulp - this task can be triggered by running `npm run sass` 
- js is bundled using webpack - this task can be triggered by running `npm run js`

Or to compile both at once, `npm run build`

### Plotly Configuration

MINT supports definition of graph layouts using [plotly.js](https://plotly.com/javascript/), and adds several possible customisations. 
The configurations themselves are provided from the [inst/json](https://github.com/mrc-ide/mintr/tree/master/inst/json) folder in mintr.  

Supported customisations are :

#### rangemode: "series"

This custom rangemode may be applied to the layout's `xaxis` or `yaxis`. It behaves similarly to plotly's autorange behaviour
but does not include shape values in the calculated default range, so that the shape line drawn for zonal budget will only 
be visible in the default range if it is not greater than any of the series values. The max of the calculated range is
the max series value plus 2% padding. The min is the lower of 0 and the min series value.  


