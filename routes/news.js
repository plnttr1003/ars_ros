var jade = require('jade');
var path = require('path');
var __appdir = path.dirname(require.main.filename);

var News = require('../models/main.js').News;


// ------------------------
// *** News Block ***
// ------------------------


exports.index = function(req, res) {
  News.find().limit(5).sort('-date').exec(function(err, news) {
    res.render('news', {news: news});
  });
}

exports.news = function(req, res) {
  var id = req.params.id;

  News.findById(id).exec(function(err, news) {
    res.render('news/news.jade', {news: news});
  });
}


exports.get_news = function(req, res) {
  var post = req.body;

  News.find().sort('-date').skip(post.skip).limit(post.limit).exec(function(err, news) {
    if (news.length > 0) {
      var data = jade.renderFile(__appdir + '/views/news/get_news.jade', {news: news});
      res.send(data);
    } else {
      res.send('out');
    }
  });
}