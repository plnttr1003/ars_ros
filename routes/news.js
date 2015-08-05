var jade = require('jade');
var path = require('path');
var __appdir = path.dirname(require.main.filename);

var News = require('../models/main.js').News;


// ------------------------
// *** News Block ***
// ------------------------


exports.index = function(req, res) {
  News.where('title.lg').equals(req.locale).where('status').ne('hidden').limit(12).sort('-date').exec(function(err, news) {
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

  News.where('title.lg').equals(req.locale).where('status').ne('hidden').sort('-date').skip(post.skip).limit(post.limit).exec(function(err, news) {
    if (news.length > 0) {
      res.send(jade.renderFile(__appdir + '/views/news/get_news.jade', {news: news, locale: req.locale}));
    } else {
      res.send('out');
    }
  });
}