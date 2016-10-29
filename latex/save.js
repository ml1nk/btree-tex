let latex = require("latex");
let gm = require("gm");
let streamToBuffer = require('stream-to-buffer');

module.exports = function(filename, latexDoc, png) {
  var fs = require('fs');
  fs.writeFile(filename+".tex",latex,function(err){
    if (err) {
      console.error("tex write error: "+filename+".tex");
    } else {
      console.log("tex written: "+filename+".tex");
    }
  });
  if (png) {
      let pdf = latex.create(latexDoc);
      streamToBuffer(pdf, function(err, buffer) {
          if (err) {
              console.error("latex invalid: " + filename + ".png");
              return;
          }
          gm(buffer).noProfile()
              .density(300, 300)
              .transparent("white")
              .trim()
              .write(filename + ".png", function(err) {
                  if (err) {
                      console.error("png write error: " + filename + ".png");
                  } else {
                      console.log("png written: " + filename + ".png");
                  }
              });
      });
  }
};
