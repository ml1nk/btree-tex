var id = require(require("path").join(__dirname, "id.js"));

module.exports = function(btree) {
  // Beispiel
  /*
  btree = {
    "order" : 2,
    "data" : [
      [
        [3]
      ],
      [
        [1,2],[4,5]
      ]
    ]
  };*/

  var data = require("./data.json");
  var latex = data.startup.join("\n");
  latex += "\n" + require("./order.js")(btree.order)  + "\n";
  latex += data.start.join("\n")+"\n";
  latex += gen(btree.data);
  latex += data.end.join("\n")+"\n";
  return latex;
};

function gen(data) {
  var output = "";
  data = data.reverse();
  var elID = 0;
  var linkID = 0;
  var subPos = [];
  for(var line=0; line<data.length; line++) {
    var pos = 0;
    var lastfix = 0;
    for(var sub=0; sub<data[line].length; sub++) {
      var el = data[line][sub];
      if(line===0) {
        pos += el.length*5+5 + lastfix;
        lastfix = el.length*5+5;
      } else {
        var mySubPos = subPos.splice(0,el.length+1);
        pos = mySubPos[0]+(mySubPos[mySubPos.length-1]-mySubPos[0])/2;
      }
      output += elBox(pos,30*line, elID, el, line===0)+"\n";
      // Verknüpfungen ergänzen
      if(line!==0) {
          for(let i=0; i<=el.length;i++) {
            output += elLink(elID,i,linkID)+"\n";
            linkID++;
          }
      }
      elID++;
      subPos.push(pos);
    }
  }
  return output;
}

function elBox(x,y, elID, el, leaf) {
  return "\\xyshift{"+x+"mm}{"+y+"mm}{\\btree"+(leaf ? "l" : "i")+"node"+id(el.length-1)+"{"+id(elID)+"}{"+el.join("}{")+"}}";
}

function elLink(node,nodePos,subnode) {
  return "\\btreelink{"+id(node)+"-"+id(nodePos)+"}{"+id(subnode)+"}";
}
