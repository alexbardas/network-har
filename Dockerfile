FROM node:slim

RUN apt-get update
RUN apt-get install -y \
  xvfb \
  libgtk2.0-0 \
  libgconf-2-4 \
  libasound2 \
  libxtst6 \
  libxss1 \
  libnss3 \
  jq

WORKDIR /src
COPY . .
RUN npm install

ENTRYPOINT ["./network-har.sh"]
CMD ["node", "bin/network-har"]
