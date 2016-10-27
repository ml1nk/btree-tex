module.exports = function(degree) {
  var id = require(require("path").join(__dirname, "id.js"));
  var output = "";
  for(let i = 0; i<degree; i++) {
    let key = id(i);
    output +=
              "\\newcommand{\\btreenode"+key+"}["+(i+2)+"]{" + "\n" +
              "\\matrix [ampersand replacement=\\&] (#1)" + "\n" +
              "{" + "\n";

    for(let p = 0; p<=i; p++) {
      output += " \\node[btreeptr] (#1-"+id(p)+") {\\vphantom{1}}; \\& \\node[btreeval] {#"+(p+2)+"}; \\&" + "\n";
    }
    output += " \\node[btreeptr] (#1-"+id(i+1)+") {\\vphantom{1}}; \\\\"+"\n"+"};" + "\n" + "}" + "\n";
  }
  return output;
};
