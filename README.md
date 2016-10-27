# dashinator [![Build Status](https://travis-ci.org/mikefarah/dashinator.svg?branch=master)](https://travis-ci.org/mikefarah/dashinator)
dashinator the daringly delightful dashboard. A node + react + redux replacement for [dashing](https://github.com/Shopify/dashing/blob/master/README.md).

Use it as an information radar for teams. I use it to monitor a bunch of micro-services across several environments, and relevant the CI builds and deployments. Because there are so many things to monitor, I don't want to clutter the dashboard making it noisy and hard to read. Instead, the dashboard only reports on failures for Production, Test environments and the CI.

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
cat myTeamsConfig.yaml | docker run -i -p 3000:3000 mikefarah/dashinator -
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

dashinator will poll the services and bamboo every 20 seconds and update the dashboard accordingly.


## Ignore self signed certificates

Set the NODE_TLS_REJECT_UNAUTHORIZED environment variable to 0.

e.g:

```
cat myTeamsConfig.yaml | docker run -i -p 3000:3000 -e NODE_TLS_REJECT_UNAUTHORIZED=0 mikefarah/dashinator -
```

or

```sh
NODE_TLS_REJECT_UNAUTHORIZED=0 ./server/index.js myTeamsConfig.yaml
```


## Contributing

Fork, make changes, run precommit.sh then create a pull request
