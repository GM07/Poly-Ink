FROM mongo:4.4.1-bionic

ENV CHROME_BIN="/usr/bin/chromium-browser"
ENV MONGOMS_SYSTEM_BINARY="/usr/bin/mongod"

RUN apt-get update && \
    apt-get install -y chromium-browser xvfb curl

# Installing node
RUN curl -sL https://deb.nodesource.com/setup_lts.x | bash - && \
    apt-get install -y nodejs

