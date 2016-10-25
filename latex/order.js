module.exports = function(order) {
  var id = require(require("path").join(__dirname, "id.js"));
  var output = "";
  for(let i = 0; i<order*2; i++) {
    let key = id(i);
    output +=
              "\\newcommand{\\btreeinode"+key+"}["+(i+2)+"]{" + "\n" +
              "\\matrix [ampersand replacement=\\&] (#1)" + "\n" +
              "{" + "\n";

    for(let p = 0; p<=i; p++) {
      output += " \\node[btreeptr] (#1-"+id(p)+") {\\vphantom{1}}; \\& \\node[btreeval] {#"+(p+2)+"}; \\&" + "\n";
    }
    output += " \\node[btreeptr] (#1-"+id(i+1)+") {\\vphantom{1}}; \\\\"+"\n"+"};" + "\n" + "}" + "\n";

    output +=
              "\\newcommand{\\btreelnode"+key+"}["+(i+2)+"]{" + "\n" +
              "\\matrix [ampersand replacement=\\&] (#1)" + "\n" +
              "{" + "\n";
    for(let p = 0; p<=i; p++) {
        output += " \\node[btreevale] {#"+(p+2)+"}; \\"+ ((i!==p) ? "&" : "\\") + "\n";
    }
    output += "};" + "\n" + "}" + "\n";
  }
  return output;
};
