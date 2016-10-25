module.exports = function(filename, latex, png) {
  var fs = require('fs');
  fs.writeFile(filename+".tex",latex,function(){});
  if(png) {
    var gm = require('graphicsmagick-stream');
    var convert = gm({
      pool: 10,
      format: 'png',
      page: 1,
      rotate: 'auto',
      density: 300,
      split: false,
      tar: false
    });
    require("latex")(latex)
                    .pipe(convert({}))
                    .pipe(fs.createWriteStream(filename+".png"));
  }
};
