FROM eclipse-temurin:21-jre

RUN mkdir /static/public -p

COPY ./app/static/public /static/public

ADD ./app/build/distributions/app-boot.tar /

ARG SPRING_PROFILES_ACTIVE
ENV SPRING_PROFILES_ACTIVE $SPRING_PROFILES_ACTIVE

RUN mkdir -p /etc/mint

ENTRYPOINT ["/app-boot/bin/app"]
