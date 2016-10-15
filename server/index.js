#!/usr/bin/env node

const fs = require('fs');

if(process.argv.length < 3) {
  console.log('Usage:')
  console.log('dasher config.yml')
  console.log('\n--Sample config--\n')
  console.log(fs.readFileSync(`${__dirname}/../sample-dashboard-config.yaml`).toString())
} else {
  require('babel-register');
  require('./server');
}
