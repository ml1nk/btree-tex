module.exports = function(filename, latex, png) {
  var fs = require('fs');
  fs.writeFile(filename+".tex",latex,function(err){
    if (err) {
      throw new Error(err);
    } else {
      console.log("tex written: "+filename+".tex");
    }
  });
  if(png) {
    var gm = require('gm');
    gm(require("latex").create(latex))
    .noProfile()
    .density(300,300)
    .transparent("white")
    .trim()
    .write(filename+".png", function (err) {
      if (err) {
        throw new Error(err);
      } else {
        console.log("png written: "+filename+".png");
      }
    });
  }
};
