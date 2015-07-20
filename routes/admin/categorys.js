var Category = require('../../models/main.js').Category;
var Event = require('../../models/main.js').Event;


// ------------------------
// *** Handlers Block ***
// ------------------------


var checkNested = function (obj, layers) {

  if (typeof layers == 'string') {
    layers = layers.split('.');
  }

  for (var i = 0; i < layers.length; i++) {
    if (!obj || !obj.hasOwnProperty(layers[i])) {
      return false;
    }
    obj = obj[layers[i]];
  }
  return true;
}


// ------------------------
// *** Admin Categorys Block ***
// ------------------------


exports.list = function(req, res) {
  Category.find().sort('-date').exec(function(err, categorys) {
    res.render('auth/categorys/', {categorys: categorys});
  });
}


// ------------------------
// *** Add Categorys Block ***
// ------------------------


exports.add = function(req, res) {
  res.render('auth/categorys/add.jade');
}

exports.add_form = function(req, res) {
  var post = req.body;

  var category = new Category();

  var locales = post.en ? ['ru', 'en'] : ['ru'];

  locales.forEach(function(locale) {
    checkNested(post, [locale, 'title'])
      && category.setPropertyLocalised('title', post[locale].title, locale);

  });

  category.status = post.status;

  category.save(function(err, category) {
    res.redirect('/auth/categorys');
  });
}


// ------------------------
// *** Edit Categorys Block ***
// ------------------------


exports.edit = function(req, res) {
  var id = req.params.id;

  Category.findById(id).exec(function(err, category) {
    res.render('auth/categorys/edit.jade', {category: category});
  });
}

exports.edit_form = function(req, res) {
  var post = req.body;
  var id = req.params.id;

  Category.findById(id).exec(function(err, category) {

    var locales = post.en ? ['ru', 'en'] : ['ru'];

    locales.forEach(function(locale) {
      checkNested(post, [locale, 'title'])
        && category.setPropertyLocalised('title', post[locale].title, locale);

    });

    category.status = post.status;

    category.save(function(err, category) {
      res.redirect('/auth/categorys');
    });
  });
}


// ------------------------
// *** Remove Categorys Block ***
// ------------------------


exports.remove = function(req, res) {
  var id = req.body.id;
  Category.findByIdAndRemove(id, function() {
    Event.update({'categorys': id}, {$pull: {'categorys': id}}, {multi: true}).exec(function() {
      res.send('ok');
    });
  });
}