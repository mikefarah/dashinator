#!/bin/bash

set -e

echo 'formatting less'
./scripts/format-less.sh

echo 'linting'
./scripts/lint-code.sh

echo 'test'
./scripts/test.sh