ARG GIT_ID="UNKNOWN"
FROM mrcide/mint-shared-build-env:$GIT_ID

CMD ./gradlew app:bootRun & sleep 90 && \
    npm run integration-test --prefix=app/static
   # TODO codecov -f app/static/coverage/integration/*.json
