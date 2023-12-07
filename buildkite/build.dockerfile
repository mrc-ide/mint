ARG GIT_ID="UNKNOWN"
ARG SPRING_PROFILE

FROM mrcide/mint-shared-build-env:$GIT_ID as build

RUN ./gradlew :app:bootDistTar

FROM openjdk:8u121

ENV NODE_ENV=production
ENV SPRING_PROFILES_ACTIVE=$SPRING_PROFILE

COPY --from=build /mint/src/app/static/public /static/public/
COPY --from=build /mint/src/app/build/distributions/app-boot.tar /
RUN tar -xf /app-boot.tar -C /

RUN mkdir -p /etc/mint

ENTRYPOINT ["/app-boot/bin/app"]
