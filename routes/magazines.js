var jade = require('jade');
var path = require('path');
var __appdir = path.dirname(require.main.filename);

var Magazine = require('../models/main.js').Magazine;


// ------------------------
// *** Magazine Block ***
// ------------------------


exports.index = function(req, res) {
  Magazine.where('title.lg').equals(req.locale).limit(12).sort('-date').exec(function(err, magazines) {
    res.render('magazines', {magazines: magazines});
  });
}

exports.magazine = function(req, res) {
  var id = req.params.id;

  Magazine.findById(id).exec(function(err, magazine) {
    res.render('magazines/magazine.jade', {magazine: magazine});
  });
}


exports.get_magazines = function(req, res) {
  var post = req.body;

  Magazine.where('title.lg').equals(req.locale).sort('-date').skip(post.skip).limit(post.limit).exec(function(err, magazines) {
    if (magazines.length > 0) {
      res.send(jade.renderFile(__appdir + '/views/magazines/get_magazines.jade', {magazines: magazines, locale: req.locale}));
    } else {
      res.send('out');
    }
  });
}