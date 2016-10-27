var path = require("path");
var escape = require("escape-latex");
var commands = require(path.join(__dirname, "commands.js"));
var data = require(path.join(__dirname, "data.json"));
var id = require(path.join(__dirname, "id.js"));

module.exports = function(tree) {
  var latex = data.startup.join("\n");
  let output = analyse(tree);
  //console.log(JSON.stringify(tree, null, 4));
  latex += "\n" + commands(output.degree)  + "\n";
  latex += data.start.join("\n")+"\n";
  latex += draw(output);
  latex += data.end.join("\n")+"\n";
  return latex;
};

function analyse(tree) {
  var output = [];
  var level = -1;
  output.push([_analyse_separate(tree)]);
  var degree = 0;
  let newLevel = true;

  while(newLevel) {
    level++;
    newLevel = false;
    for(let i=0; i<output.length; i++) {
      let newSub = false;
      if(output[i].length!==level+1) {
        continue;
      }
      let cur = output[i][level];
      let base = output[i].slice(0);
      let myDegree = cur.keys.length;
      degree = (degree<myDegree) ? myDegree : degree;
      for(let p=0; p<cur.subs.length; p++) {
        if(cur.subs[p] === null) {
          continue;
        }
        if(!newSub) {
          output[i].push(_analyse_separate(cur.subs[p]));
          newSub = true;
        }else {
          let newOutput = base.slice(0);
          newOutput.push(_analyse_separate(cur.subs[p]));
          output.splice(i+1, 0, newOutput);
          i++;
        }
        newLevel = true;
      }
    }
  }

  return {
    degree : degree,
    level : level,
    output : output
  };
}

function _analyse_separate(node) {
  return {
    keys : node.filter(function(value, key){
      return (key+1)%2===0;
    }),
    subs : node.filter(function(value, key){
      return key%2===0;
    })
  };
}

function draw(data) {
  let output = "";
  let links = "";
  for(let p=data.level;p>=0; p--) {
    let position = 0;
    for(let i=0;i<data.output.length; i++) {
        if(p>=data.output[i].length || data.output[i][p].hasOwnProperty("width")) {
          position+=data.output[i].length>p ? 0 : 1;
          continue;
        }
        data.output[i][p].width = 1;
        if(data.output[i].length-1!==p) {
          let [link, width] = _calc_linkWidth(data.output, i, p, data.level);
          data.output[i][p].width = width;
          links += link;
        }
        let myPos = position + (data.output[i][p].width)/2;
        position+=data.output[i][p].width;
        output += elBox(myPos*(data.degree*10+5),-p*30, i*data.level+p, data.output[i][p].keys, true);
    }
  }
  return output+"\n\n"+links;
}

function _calc_linkWidth(output, i, p, level) {
  var subs = 0;
  var subsPos = [];
  for(let q=0; q<output[i][p].subs.length; q++) {
    if(output[i][p].subs[q] !== null) {
      subs++;
      subsPos.push(q);
    }
  }
  width = 0;
  link = "";
  var pos = i;
  for(let q=i; q<i+subs; q++) {
    width += output[pos][p+1].width;
    link += elLink(p+i*level,subsPos[q-i],p+1+pos*level);
    pos += output[pos][p+1].width;
  }
  return [link,  width];
}

function elBox(x,y, elID, el, leaf) {
  return "\\xyshift{"+x+"mm}{"+y+"mm}{\\btreenode"+id(el.length-1)+"{"+id(elID)+"}{"+el.map(function(value){
    return escape(value);
  }).join("}{")+"}}\n";
}

function elLink(node,nodePos,subnode) {
  return "\\btreelink{"+id(node)+"-"+id(nodePos)+"}{"+id(subnode)+"}\n";
}
