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

1. Clone this repo
1. Run `npm install` from `src/app/static`
1. Run `npm run build` from `src/app/static` to compile front-end dependencies.
1. Run app from your IDE or by `cd src && ./gradlew :app:bootRun` to serve the app on port 8080

### Back-end Testing

Execute tests on the command line or through IntelliJ:
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
