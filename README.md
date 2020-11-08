## MINT - Malaria Indicators Tool
[![Project Status: WIP – Initial development is in progress, but there has not yet been a stable, usable release suitable for the public.](https://www.repostatus.org/badges/latest/wip.svg)](https://www.repostatus.org/#wip)
[![Build Status](https://travis-ci.com/mrc-ide/mint.svg?branch=master)](https://travis-ci.com/mrc-ide/mint)
[![codecov](https://codecov.io/gh/mrc-ide/mint/branch/master/graph/badge.svg)](https://codecov.io/gh/mrc-ide/mint)

To make use of a built docker image:

```
docker run --rm -p 8080:8080 mrcide/mint
```
 
### Developing
Requirements:
* Docker
* npm
* openjdk 8
* coreutils or realpath (Mac users only)

1. Clone this repo
1. Run `npm install` from `src/app/static`
1. Run `npm run build` from `src/app/static` to compile front-end dependencies.
1. Run `./scripts/run-development-dependencies.sh` to start docker instances of [mintr](https://github.com/mrc-ide/mintr)
1. Run app from your IDE or by `cd src && ./gradlew :app:bootRun` to serve the app on port 8080

For more information about developing the front-end see [src/app/static/README](https://github.com/mrc-ide/mint/blob/master/src/app/static/README.md)

### Back-end Testing

Ensure dependencies are running and execute tests on the command line or through IntelliJ:
1. `./scripts/run-development-dependencies.sh`
1. `./src/gradlew -p src app:test`

### Front-end Testing
1. To run unit tests, run `npm test` from `src/app/static`
2. To run integration tests, run `./scripts/run-dependencies` then `npm run integration-test`, both from `src/app/static`

### Distribution
A docker image containing the app is created by running 

```
./scripts/build-app.sh
```
 
This is run for each branch as part of the Travis build and the resulting image pushed to Dockerhub. 
To run:

```
docker run -p 8080:8080 mrcide/mint:branch_name
```

or

```
docker run -p 8080:8080 mrcide/mint:git_sha
```
