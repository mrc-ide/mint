ARG GIT_ID="UNKNOWN"
FROM mrcide/mint-shared-build-env:$GIT_ID

ARG SPRING_PROFILE
ARG TAG

ENV NODE_ENV=production

RUN ./gradlew :app:bootDistTar

ENV SPRING_PROFILE=$SPRING_PROFILE
ENV TAG=$TAG

CMD docker build --build-arg SPRING_PROFILES_ACTIVE=$SPRING_PROFILE -f /mint/Dockerfile --tag $TAG .
