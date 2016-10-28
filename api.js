var path = require("path");

function generate(json, prefix, png, all) {
  if(png && !pngReady()) {
    throw new Error("tree-tex: optional dependencies is required for png output");
  }

  var convert = require(path.join(__dirname, "latex", "convert.js"));
  var save = require(path.join(__dirname, "latex", "save.js"));

  if(Array.isArray(json)) {
    save(prefix,convert(json),png);
  } else {
    let counter = 1;
    var result = _execute(json, !all ? null : function(data, operation, parameter) {
      save(prefix+"-"+counter+"-"+operation+"-"+parameter,convert(data),png);
      counter++;
    });
    if(!all) {
      save(prefix,convert(result),png);
    }
  }
}

function pngReady() {
  try {
      require.resolve("gm");
      require.resolve("latex");
      return true;
  } catch(e) {
      return false;
  }
}

function _execute(json, callback) {

  if(json.logic.type !== "btree") {
    throw new Error("tree-tex: unsupported logic type");
  }
  var node = require(path.join(__dirname, "tree", "node.js"));
  var logic = (require(path.join(__dirname, "tree", "logic", "btree.js")))(json.logic.options, node);

  //console.log(logic);

  var tree = new (require(path.join(__dirname, "tree", "tree.js")))(logic);



  /*
  tree.root.insertLeft(0,2,new node(tree.root.logic, [2,1],[null,null,null]));
  tree.root.insertLeft(0,3,new node(tree.root.logic, [4],[null,null]));
  tree.root.setSub(2,new node(tree.root.logic, [5], [null,null]));


  tree.root.subs[0].setSub(0,new node(tree.root.logic, [1],[null,null]));
  tree.root.subs[0].setSub(1,new node(tree.root.logic, [2],[null,null]));

  tree.root.subs[1].setSub(0,new node(tree.root.logic, [1], [null,null]));
  tree.root.subs[1].setSub(1,new node(tree.root.logic, [2], [null,null]));


  tree.root.subs[2].setSub(0,new node(tree.root.logic, [1],[null,null]));
  tree.root.subs[2].setSub(1,new node(tree.root.logic, [2],[null,null]));


  console.log(tree.root.subs[2]);
  tree.root.subs[2].moveDownLeft(0);
  console.log(tree.root.subs[2]);
  */
  //tree.root.subs[0].merge(0);
  //console.log(tree.root.merge(0));
  //tree.root.subs[1].merge(0);
  //tree.root.subs[2].merge(0);
  //tree.root.subs[2].moveUpLeft();
  //tree.root.subs[0].moveUpRight();
  //tree.root.subs[1].moveUpRight();
  //tree.root.setSub(2,new node(tree.root.logic, [11], [null,null]));
  //tree.root = tree.root.merge(0);
  //callback(tree.data(),"a","b");

  for(var i=0; i<json.todo.length; i++) {
      var command = json.todo[i];
      for(var p=0; p<command.parameter.length; p++) {
        tree[command.operation](command.parameter[p]);
        if(typeof callback === "function") {
            callback(tree.data(),command.operation,command.parameter[p]);
        }
      }
  }
}

module.exports = {
  generate : generate,
  pngReady : pngReady
};
