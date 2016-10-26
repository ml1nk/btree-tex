var path = require("path");
var api = require(path.join(__dirname, "api.js"));

var a = require(path.join(__dirname, "examples", "a.json"));
var b = require(path.join(__dirname, "examples", "b.json"));
var c = require(path.join(__dirname, "examples", "c.json"));
var d = require(path.join(__dirname, "examples", "d.json"));
var e = require(path.join(__dirname, "examples", "e.json"));

var a_prefix = path.join(__dirname, "examples", "a","a");
var b_prefix = path.join(__dirname, "examples", "b","b");
var c_prefix = path.join(__dirname, "examples", "c","c");
var d_prefix = path.join(__dirname, "examples", "d","d");
var e_prefix = path.join(__dirname, "examples", "e","e");

api.generate(a,a_prefix,true,true);
api.generate(b,b_prefix,true,true);
api.generate(c,c_prefix,true,true);
api.generate(e,e_prefix,true,true);
