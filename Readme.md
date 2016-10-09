network-har
===========

[![Build Status](https://travis-ci.org/alexbardas/network-har.svg?branch=master)](https://travis-ci.org/alexbardas/network-har)

- [What is network-har?](#what-is-network-har)
- [Use cases](#use-cases)
- [Getting started](#getting-started)
- [Options](#options)
- [Examples](#examples)
- [Contributing](#contributing)


## What is network-har?
CLI utility that uses [Nightmare.js](https://nightmarejs.org) and the [nightmare har plugin](https://github.com/alexbardas/nightmare-har-plugin) to capture network activity in HAR (HTTP Archive) format. It also provides a docker image which retrieves the HAR by running nightmarejs headlessly.


## Use cases
- integration testing (are specific requests being made? how often?)
- performance testing (HAR contains number detailed timing information of network requests)
- getting page weight, number of js / css / ajax / font / ... requests


## Getting started
Only *1 command* is required to be executed to retrive the network information. Can be used as a:
1. nodejs binary: `network-har [options]`
2. docker image (runs in a headless electron environment): `docker run --rm alexbardas/network-har [options]`

### 1. From nodejs
##### Install
`npm install -g network-har`

##### Usage
`network-har [options]`

### 2. From docker
##### Install
`docker pull alexbardas/network-har`

##### Usage
`docker run --rm alexbardas/network-har [options]`

Gain access inside the container:
```sh
docker run -it --entrypoint=/bin/bash --rm alexbardas/network-har
root@containerid:/src# ./network-har.sh [options]
```

##### Usefulness
The `network-har.sh` (docker's image entrypoint) can be used to headlessly retrieve the network information in a CI step which is based on the `alexbardas/network-har` docker image.

[Jq](https://stedolan.github.io/jq/) command line JSON preprocessor is already installed on the provided docker image, so the json HAR output can be very easily parsed inside the container.

### API
The following commands can be interchangable, but they depend on the executing environment:
- `network-har [options]` (if nodejs is available and the `network-har` npm package is installed and if the environment already has an X server -> many ifs)
- `docker run --rm alexbardas/network-har [options]` (if docker is installed)
- `./network-har.sh [options]` (inside a docker container created from the provided image. Useful in a CI step)


## Options
##### `--help`
Prints detailed help information.
```sh
docker run --rm alexbardas/network-har --help
```

##### `--url string` (required)
The website for which the har information is needed.
```sh
docker run --rm alexbardas/network-har \
  --url https://news.ycombinator.com
```

##### `--header string:string` (optional, default: none)
Additional headers to be added to the http request. Can be used multiple times.
```sh
docker run --rm alexbardas/network-har \
  --url https://news.ycombinator.com \
  --header "Cache-Control:no-cache" \
  --header "Accept-Language:en-us"
```

##### `--retries number` (optional, default: 2)
Number of maximum retries for getting the network HAR in case the the command fails with a network error. Useful because electron can have intermittent network failures.
```sh
docker run --rm alexbardas/network-har \
  --url https://news.ycombinator.com \
  --retries 3
```

##### `--useragent string` (optional, default: none)
Overrides default electron useragent with a new value.
```sh
docker run --rm alexbardas/network-har \
  --url https://news.ycombinator.com \
  --useragent "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2860.0 Safari/537.36"
```

##### `--viewport number,number` (optional, default: 375,667)
Overrides default electron viewport with new values.
```sh
docker run --rm alexbardas/network-har \
  --url https://news.ycombinator.com \
  --viewport 1366,768
```

##### `--wait number` (optional, default: 5000)
Waits for the specified number of ms after the request is made until retrieving the network information.
```sh
docker run --rm alexbardas/network-har \
  --url https://news.ycombinator.com \
  --wait 10000
```

##### `--wait string` (optional, default: none)
Waits for a specific element defined by a string selector to be available in the DOM.
```sh
docker run --rm alexbardas/network-har \
  --url https://news.ycombinator.com \
  --wait "#hnmain"
```

## Examples
Retrieve the network HAR for hackernews for:
- `1024x768` viewport
- `network-har` useragent
- `Cache-Control: no-cache` and `Accept-Language: en-US` headers
- `10s` wait time for network resources
- `3` maximum retries
- '#hnmain' waits for the element having this selector to be in the DOM

```
docker run --rm alexbardas/network-har \
  --url https://news.ycombinator.com \
  --viewport 1024,768 \
  --header "Cache-Control:no-cache" \
  --header "Accept-Language:en-US" \
  --retries 3 \
  --wait "#hnmain"
```
