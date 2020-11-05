ARG GIT_ID="UNKNOWN"
FROM mrcide/mint-shared-build-env:$GIT_ID

CMD npm run lint --prefix=app/static -- --quiet && \
    npm test --prefix=app/static
   # TODO codecov -f app/static/coverage/*.json && \
   # TODO codecov -f app/static/coverage/integration/*.json
