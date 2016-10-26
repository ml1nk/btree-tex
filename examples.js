var api = require(require("path").join(__dirname, "api.js"));

var a = require(require("path").join(__dirname, "examples", "a.json"));
var b = require(require("path").join(__dirname, "examples", "b.json"));
var c = require(require("path").join(__dirname, "examples", "c.json"));
var d = require(require("path").join(__dirname, "examples", "d.json"));

var a_prefix = require("path").join(__dirname, "examples", "a","a");
var b_prefix = require("path").join(__dirname, "examples", "b","b");
var c_prefix = require("path").join(__dirname, "examples", "c","c");
var d_prefix = require("path").join(__dirname, "examples", "d","d");

api.generate(a,a_prefix,true,true);
api.generate(b,b_prefix,true,true);
api.generate(c,c_prefix,true,true);
api.generate(d,d_prefix,true,true);
