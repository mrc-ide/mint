## HINT - Malaria Indicators Tool

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
1. `./src/gradlew -p src app::test`

### Front-end Testing
1. To run unit tests, run `npm test` from `src/app/static`
2. To run integration tests, run `./scripts/run-dependencies` then `npm run integration-test`, both from `src/app/static`




