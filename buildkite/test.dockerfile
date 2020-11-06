ARG GIT_ID="UNKNOWN"
FROM mrcide/mint-shared-build-env:$GIT_ID

COPY ./src/app/static/scripts/test.properties /etc/mint/config.properties

# Test app
CMD ./gradlew :app:detektMain :app:test :app:jacocoTestReport
   # TODO && codecov -f app/coverage/test/*.xml
