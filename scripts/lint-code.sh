#!/bin/bash

set -e

./scripts/list-javascript.sh | xargs ./node_modules/.bin/eslint --fix