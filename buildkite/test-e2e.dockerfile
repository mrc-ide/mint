ARG GIT_ID="UNKNOWN"
FROM mrcide/mint-shared-build-env:$GIT_ID

RUN cd app/static && npx playwright install chromium

# Playwright has a `install-deps` command we could use instead of this, except
# we use an old version of playwright which doesn't support Debian. We can't
# update playwright because our node version is too old.
RUN apt-get install -y \
    libnss3 libatk1.0-0 libatk-bridge2.0-0 libcups2 libdrm2 libxkbcommon0 \
    libxcomposite1 libxdamage1 libxfixes3 libxrandr2 libgbm1 libxshmfence1

CMD ./gradlew app:bootRun & sleep 90 && \
    npm run e2e-test --prefix=app/static
