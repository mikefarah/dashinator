#!/bin/bash
set -e
find . -name "*.js" -not -path "*/node_modules/*" -not -path "./coverage/*" -not -path "./public/bundle*"
