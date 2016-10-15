# dasher [![Build Status](https://travis-ci.org/mikefarah/dasher.svg?branch=master)](https://travis-ci.org/mikefarah/dasher)
Dasher the daringly delightful dashboard. A node + react + redux replacement for [dashing](https://github.com/Shopify/dashing/blob/master/README.md).

I use it to monitor a bunch of micro-services across several environments, and relevant the CI builds and deployments. Because there are so many things to monitor, I don't want to clutter the dashboard making it noisy and hard to read. Instead, the dashboard only reports on failures for Production, Test environments and the CI.

Currently it supports Bamboo, happy for pull requests to accept other CI tools too :)

![Screenshot](screenshot.png)

## Usage

```sh
npm install -g dasher
dasher myTeamsConfig.yaml
```

Alternatively, you can install it locally:

```sh
npm install dasher
./node_modules/.bin/dasher myTeamsConfig.yaml
```

Then browse to http://localhost:3000

## Example config YAML

```yaml
productionEnvironment:
  - name: http listener
    url: http://localhost:9999

testEnvironments:
  - name: DEV http listener
    url: http://localhost:9999
  - name: QA http listener
    url: http://localhost:9999

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

## TODO

- Moar unit tests
- Dockerify


## Contributing

Fork, make changes, run precommit.sh then create a pull request
