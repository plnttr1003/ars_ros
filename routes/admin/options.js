var path = require('path');
var gm = require('gm').subClass({ imageMagick: true });

var __appdir = path.dirname(require.main.filename);

exports.preview = function(req, res) {
  var files = req.files;
  var newPath = '/images/preview/' + Date.now() + '.' + files.image.extension;

  gm(files.image.path).resize(1200, false).quality(80).write(__appdir + '/public' + newPath, function() {
    res.send(newPath);
  });
}