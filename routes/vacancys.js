var jade = require('jade');
var path = require('path');
var __appdir = path.dirname(require.main.filename);

var Vacancy = require('../models/main.js').Vacancy;


// ------------------------
// *** vacancys Block ***
// ------------------------


exports.index = function(req, res) {
  Vacancy.where('title.lg').equals(req.locale).where('status').ne('hidden').limit(12).sort('-date').exec(function(err, vacancys) {
    res.render('vacancys', {vacancys: vacancys});
  });
}

exports.vacancys = function(req, res) {
  var id = req.params.id;

  Vacancy.findById(id).exec(function(err, vacancy) {
    res.render('vacancys/vacancy.jade', {vacancy: vacancy});
  });
}

exports.get_vacancys = function(req, res) {
  var post = req.body;

  Vacancy.where('title.lg').equals(req.locale).where('status').ne('hidden').sort('-date').skip(post.skip).limit(post.limit).exec(function(err, vacancy) {
    if (vacancys.length > 0) {
      res.send(jade.renderFile(__appdir + '/views/vacancys/get_vacancys.jade', {vacancy: vacancy, locale: req.locale}));
    } else {
      res.send('out');
    }
  });
}