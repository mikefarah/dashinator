#!/bin/bash

version=$(cat package.json | jq .version -r)
docker build -t mikefarah/dashinator:${version} .

docker tag mikefarah/dashinator:${version} mikefarah/dashinator:latest
