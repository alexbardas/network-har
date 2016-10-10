FROM node:slim
MAINTAINER Alex Bardas <alex.bardas@gmail.com>

RUN echo 'deb http://httpredir.debian.org/debian jessie-backports main contrib non-free' >> /etc/apt/sources.list
RUN apt-get update \
  && apt-get -t jessie-backports install -y \
  jwm \
  && apt-get install -qqy \
  xvfb \
  libgtk2.0-0 \
  libgconf-2-4 \
  libasound2 \
  libxtst6 \
  libxss1 \
  libnss3 \
  x11vnc \
  jq \
  && rm -rf /var/lib/apt/lists/* /var/cache/apt/*

WORKDIR /src
COPY . .
RUN npm -s install

ENTRYPOINT ["./network-har.sh"]
CMD ["node", "bin/network-har"]
