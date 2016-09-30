#!/bin/bash

set -e

echo 'formatting code'
./scripts/format-code.sh

echo 'linting'
./scripts/lint-code.sh
