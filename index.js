#!/usr/bin/env node
var path = require('path');
var program = require('commander');

program
  .version(require(require("path").join(__dirname,'package.json')).version)
  .usage('[options] <input_json> <output_prefix>')
  .option('-p, --png', 'generate .png in addition to .tex')
  .option('-a, --all', 'create file(s) for every step if json contains instructions')
  .parse(process.argv);

if(program.args.length!=2) {
  program.outputHelp();
  process.exit(1);
}

try {
  var json = require(path.join(process.cwd(),program.args[0]));
} catch(e) {
  console.error("input file not found");
  process.exit(1);
}

var api = require(path.join(__dirname, "api.js"));
api.generate(json,program.args[1],program.png,program.all);
