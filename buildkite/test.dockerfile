ARG GIT_ID="UNKNOWN"
FROM mrcide/mint-shared-build-env:$GIT_ID

# Test app
CMD ./gradlew :app:detektMain :app:test :app:jacocoTestReport
   # TODO && codecov -f app/coverage/test/*.xml
