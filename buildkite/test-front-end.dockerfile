ARG GIT_ID="UNKNOWN"
FROM mrcide/mint-shared-build-env:$GIT_ID

CMD npm run lint --prefix=app/static -- --quiet && \
    npm test --prefix=app/static
    codecov -p .. -f app/static/coverage/*.json
