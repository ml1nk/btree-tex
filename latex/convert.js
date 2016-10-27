var path = require("path");
var commands = require(path.join(__dirname, "commands.js"));
var data = require(path.join(__dirname, "data.json"));
var id = require(path.join(__dirname, "id.js"));

module.exports = function(tree) {
  var latex = data.startup.join("\n");

  var [degree, level] = getDegreeLevel(tree);

  latex += "\n" + commands(degree)  + "\n";
  latex += data.start.join("\n")+"\n";
  latex += generate(tree, degree, level);
  latex += data.end.join("\n")+"\n";
  return latex;
};

function positions(degree, level) {
  return Math.pow(degree+1, level);
}

function pos(diff, degree, level, i) {
  return (i*degree*10+5) + diff;
}

function getDegreeLevel(tree) {
  var [degree, level] = _getDegreeLevel(tree);
  level--;
  return [degree, level];

  function _getDegreeLevel(curTree) {
    let degree = Math.floor(curTree.length/2);
    let level = 1;
    for(let i=0; i<curTree.length; i+=2) {
      if(curTree[i]===null) {
        continue;
      }
      let [subDegree, subLevel] = _getDegreeLevel(curTree[i]);
      if(subDegree>degree) {
        degree = subDegree;
      }
      if(level < subLevel+1) {
        level = subLevel+1;
      }
    }
    return [degree, level];
  }
}



function generate(tree, degree, level) {
  var onePositionWidth = (degree*10+5);
  var maxPositions = positions(degree, level);
  var maxWidth = maxPositions * onePositionWidth;

  console.log(onePositionWidth,maxPositions,maxWidth,degree, level);

  return _generate(0,0,tree);
  function _generate(curLevel, curPos, me) {
    var output = "";
    let leaf = true;
    for(let i=0; i<me.length; i+=2) {
      if(me[i] === null) {
        continue;
      }
      leaf = false;
      output += _generate(curLevel+1, curPos*degree+(i/2), me[i]);
    }


    console.log("a",(maxPositions/positions(degree, curLevel)));
    output += elBox(onePositionWidth*(maxPositions/positions(degree, curLevel))*(curPos+0.5),-curLevel*30, id(curLevel)+"-"+id(curPos), me.filter(function(value, key){
      return (key+1)%2===0;
    }), leaf);

    return output;
  }

}


function gen(data,level) {
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
