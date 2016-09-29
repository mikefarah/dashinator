#!/bin/bash
set -e
(./scripts/list-javascript.sh | xargs ./node_modules/.bin/esformatter -i)
