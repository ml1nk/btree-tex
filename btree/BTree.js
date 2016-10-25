var Knoten = require(require("path").join(__dirname, "Knoten.js"));

class BTree {
  constructor(ordnung) {
    this.wurzel = new Knoten(ordnung,null,[],[]);
  }

  insert(schluesselwert, satz) {
    var result = this.wurzel.insert(schluesselwert, satz);
    if(result === false || result === true) {
        return result;
    }
    this.wurzel = result;
    return true;
  }

  delete(schluesselwert) {
      return this.wurzel.delete(schluesselwert);
  }

  read(schluesselwert) {
    return this.wurzel.read(schluesselwert);
  }

  data() {
    var output = [];
    var curLevel = [this.wurzel];
    var nexLevel = [];
    while(curLevel.length>0) {
      var level = [];
      for(let i=0;i<curLevel.length;i++) {
        var entry = [];
        for(let p=0;p<curLevel[i].eintraege.length;p++) {
          entry.push(curLevel[i].eintraege[p].getSchluesselwert());
        }
        level.push(entry);
        for(let p=0;p<curLevel[i].unterbaeume.length;p++) {
            nexLevel.push(curLevel[i].unterbaeume[p]);
        }
      }
      output.push(level);
      curLevel = nexLevel;
      nexLevel = [];
    }
    return {
      order : this.wurzel.ordnung,
      data : output
    };
  }
}

module.exports = BTree;
