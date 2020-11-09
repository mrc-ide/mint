FROM vimc/node-docker-openjdk:master

# Setup gradle
COPY ./src/gradlew /mint/src/
COPY ./src/gradle /mint/src/gradle/
WORKDIR /mint/src
RUN ./gradlew

# Pull in dependencies
COPY ./src/build.gradle /mint/src/
COPY ./src/settings.gradle /mint/src/
COPY ./src/config/ /mint/src/config/

RUN ./gradlew
RUN npm install codecov -g

# Install front-end dependencies
COPY ./src/app/static/package.json /mint/src/app/static/package.json
COPY ./src/app/static/package-lock.json /mint/src/app/static/package-lock.json
RUN npm ci --prefix=app/static

# Copy source
COPY . /mint
RUN ./gradlew :app:compileKotlin
