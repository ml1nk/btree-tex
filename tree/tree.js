var path = require("path");
var node = require(path.join(__dirname, "node.js"));

class tree {
  constructor(logic) {
    this.root = new node(logic,[], [null]);
  }

  /*
   *  true => new value inserted
   *  false => already inserted
   */
  insert(key) {
    var result = this.root.logic.insert(this.root, key);
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
    var result = this.root.logic.insert(this.root, key);
    if(result === false || result === true) {
        return result;
    }
    this.root = result;
    return true;
  }

  /*
   * true => found
   * false => not found
   */
  //read(key) {
  //  return this.root.logic.read(key);
  //}

  data() {
    return this.root.data();
  }

}

module.exports = tree;
