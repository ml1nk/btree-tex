var path = require("path");

function generate(json, prefix, png, all) {
  if(png && !pngReady()) {
    throw new Exception("tree-tex: optional dependencies is required for png output");
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
  var btree = new (require(path.join(__dirname, "btree", "BTree.js")))(json.order);
  for(var i=0; i<json.todo.length; i++) {
      var command = json.todo[i];
      for(var p=0; p<command.parameter.length; p++) {
        btree[command.operation](command.parameter[p]);
        if(typeof callback === "function") {
            callback(btree.data(),command.operation,command.parameter[p]);
        }
      }
  }
  return (typeof callback === "function") ? true : btree.data();
}

module.exports = {
  generate : generate,
  pngReady : pngReady
};
