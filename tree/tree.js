var path = require("path");
var node = require(path.join(__dirname, "node.js"));

class tree {
  constructor() {
    this.root = new node({},[null],[]);
  }

  /*
   *  true => new value inserted
   *  false => already inserted
   */
  insert(key) {
    var result = this.root.insert(key);
    if(result === false || result === true) {
        return result;
    }
    this.root = result;
    return true;
  }

  /*
   * true => deleted
   * false => not found
   */
  delete(key) {
      return this.root.delete(key);
  }

  /*
   * true => found
   * false => not found
   */
  read(key) {
    return this.root.read(key);
  }

  data() {
    return this.root.data();
  }

}

module.exports = tree;
