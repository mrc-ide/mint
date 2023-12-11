# Setup a combined nodejs and openjdk image
# Eventually this should be extracted into something we can publish and cache
FROM node:20-bookworm
RUN curl -fsSL -o /usr/share/keyrings/docker.asc https://download.docker.com/linux/debian/gpg && \
    curl -fsSL -o /usr/share/keyrings/adoptium.asc https://packages.adoptium.net/artifactory/api/gpg/key/public
RUN echo "deb [arch=amd64, signed-by=/usr/share/keyrings/docker.asc] https://download.docker.com/linux/debian bookworm stable" > /etc/apt/sources.list.d/docker.list
RUN echo "deb [arch=amd64, signed-by=/usr/share/keyrings/adoptium.asc] https://packages.adoptium.net/artifactory/deb bookworm main" > /etc/apt/sources.list.d/adoptium.list
RUN apt-get update && apt-get install -y temurin-17-jdk docker-ce

# Setup gradle
COPY ./src/gradlew /mint/src/
COPY ./src/gradle /mint/src/gradle/
COPY ./src/settings.gradle /mint/src/
WORKDIR /mint/src
RUN ./gradlew

# Pull in dependencies
COPY ./src/build.gradle /mint/src/
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
