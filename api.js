module.exports = function(json, prefix, png) {
  var fullyOperational = true;
  try {
      require.resolve("gm");
      require.resolve("latex");
  } catch(e) {
      fullyOperational = false;
  }

  if(!fullyOperational && png) {
    console.error("optional dependencies is required for png output");
    process.exit(1);
  }

  var BTree = require(require("path").join(__dirname, "btree", "BTree.js"));
  var convert = require(require("path").join(__dirname, "latex", "convert.js"));
  var save = require(require("path").join(__dirname, "latex", "save.js"));
  var btree = new BTree(json.order);
  var commandID = 1;
  for(var i=0; i<json.todo.length; i++) {
      var command = json.todo[i];
      if(command.operation === "insert") {
        for(let p=0; p<command.parameter.length; p++) {
          btree.insert(command.parameter[p]);
          save(prefix+"-"+commandID+"-insert-"+command.parameter[p],convert(btree.data()),png);
          commandID++;
        }
      } else if(command.operation === "delete") {
        for(let p=0; p<command.parameter.length; p++) {
          btree.delete(command.parameter[p]);
          save(prefix+"-"+commandID+"-delete-"+command.parameter[p],convert(btree.data()),png);
          commandID++;
        }
      } else {
        throw new Exception("unknown operation");
      }
  }
};
