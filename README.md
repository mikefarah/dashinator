# dasher [![Build Status](https://travis-ci.org/mikefarah/dasher.svg?branch=master)](https://travis-ci.org/mikefarah/dasher)
Dasher the daringly delightful dashboard. A node + react + redux replacement for [dashing](https://github.com/Shopify/dashing/blob/master/README.md).

I use it to monitor a bunch of micro-services across several environments, and relevant the CI builds and deployments. Because there are so many things to monitor, I don't want to clutter the dashboard making it noisy and hard to read. Instead, the dashboard only reports on failures for Production, Test environments and the CI.

Currently it supports Bamboo, happy for pull requests to accept other CI tools too :)

![Screenshot](screenshot.png)

## Usage

### GIT
Clone the repo then
```sh
./server/index.js myTeamsConfig.yaml
```

### Docker

```
cat myTeamsConfig.yaml | docker run -i -p 3000:3000 mikefarah/dasher -
```

Then browse to http://localhost:3000

## Example config YAML

```yaml
productionEnvironment:
  - name: http listener
    url: http://localhost:9999/health_check

testEnvironments:
  - name: DEV http listener
    url: http://localhost:9999/health_check
  - name: QA http listener
    url: http://localhost:9999/health_check

bamboo:
  baseUrl: https://bamboo.com
  requestOptions:
    strictSSL: false
    auth:
      user: user
      password: password
  plans:
      - AWESOME-PLAN
```

The health_check endpoints are assumed to return a successful HTTP response code if the service is healthy (successful as defined by node's request library).

Dasher will poll the services and bamboo every 20 seconds and update the dashboard accordingly.

## TODO

- More unit tests

## Contributing

Fork, make changes, run precommit.sh then create a pull request
