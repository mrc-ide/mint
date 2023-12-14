ARG GIT_ID="UNKNOWN"
FROM mrcide/mint-shared-build-env:$GIT_ID

RUN cd app/static && npx playwright install --with-deps chromium

CMD ./gradlew app:bootRun & sleep 90 && \
    npm run e2e-test --prefix=app/static
