// node index.js examples/a.json test/a -a -p


var path = require("path");
var api = require(path.join(__dirname, "..", "api.js"));

var btree_a = require(path.join(__dirname, "btree_a.json"));
var btree_b = require(path.join(__dirname, "btree_b.json"));
var btree_c = require(path.join(__dirname, "btree_c.json"));
var btree_d = require(path.join(__dirname, "btree_d.json"));
var state_btree_a = require(path.join(__dirname, "state_btree_a.json"));
var state_logic_a = require(path.join(__dirname, "state_logic_a.json"));

var bplustree_a = require(path.join(__dirname, "bplustree_a.json"));
var bplustree_b = require(path.join(__dirname, "bplustree_b.json"));


var btree_a_prefix = path.join(__dirname, "dist","btree_a");
var btree_b_prefix = path.join(__dirname, "dist","btree_b");
var btree_c_prefix = path.join(__dirname, "dist","btree_c");
var btree_d_prefix = path.join(__dirname, "dist","btree_d");
var state_btree_a_prefix = path.join(__dirname, "dist","state_btree_a");
var state_logic_a_prefix = path.join(__dirname, "dist","state_logic_a");

var bplustree_a_prefix = path.join(__dirname, "dist","bplustree_a");
var bplustree_b_prefix = path.join(__dirname, "dist","bplustree_b");

api.generate(btree_a,btree_a_prefix,true,true);
api.generate(btree_b,btree_b_prefix,true,true);
api.generate(btree_c,btree_c_prefix,true,true);
api.generate(btree_d,btree_d_prefix,true,true);
api.generate(state_btree_a,state_btree_a_prefix,true,true);
api.generate(state_logic_a,state_logic_a_prefix,true,true);

api.generate(bplustree_a,bplustree_a_prefix,true,true);
api.generate(bplustree_b,bplustree_b_prefix,true,true);
