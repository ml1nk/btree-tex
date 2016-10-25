#!/usr/bin/env node
var program = require('commander');

program
  .version(require(require("path").join(__dirname,'package.json')).version)
  .option('-i, --input [json]', '(required) json file for execution', String)
  .option('-o, --output [prefix]', '(required) prefix for all generated files', String)
  .option('-p, --png', 'generate .png in addition to .tex (optional dependencies required)')
  .parse(process.argv);

if(!program.input || !program.output) {
  program.outputHelp();
  process.exit(1);
}

var json = require(require("path").join(process.cwd(),program.input));
var api = require(require("path").join(__dirname, "api.js"));
api(json,program.output,program.png);
