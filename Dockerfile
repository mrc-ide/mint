FROM openjdk:8u121

RUN mkdir /static/public -p

COPY ./src/app/static/public /static/public

ADD ./src/app/build/distributions/app-boot.tar /

ARG SPRING_PROFILES_ACTIVE
ENV SPRING_PROFILES_ACTIVE $SPRING_PROFILES_ACTIVE

ENTRYPOINT ["/app-boot/bin/app"]