var path = require('path');
var mkdirp = require('mkdirp');
var async = require('async');
var gm = require('gm').subClass({ imageMagick: true });

var History = require('../../models/main.js').History;

var __appdir = path.dirname(require.main.filename);


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
// *** Admin History Block ***
// ------------------------


exports.list = function(req, res) {
  History.find().exec(function(err, historys) {
    res.render('auth/history/', {historys: historys});
  });
}


// ------------------------
// *** Add History Block ***
// ------------------------


exports.add = function(req, res) {
  res.render('auth/history/add.jade');
}

exports.add_form = function(req, res) {
  var post = req.body;
  var files = req.files;
  var images = [];

  var history = new History();

  var locales = post.en ? ['ru', 'en'] : ['ru'];

  locales.forEach(function(locale) {
    checkNested(post, [locale, 'title'])
      && history.setPropertyLocalised('title', post[locale].title, locale);

    checkNested(post, [locale, 'description'])
      && history.setPropertyLocalised('description', post[locale].description, locale);
  });

  history.interval.start = new Date(Date.UTC(post.date_start.year, post.date_start.month, post.date_start.date));
  history.interval.end = new Date(Date.UTC(post.date_end.year, post.date_end.month, post.date_end.date));

  if (!post.images) {
    return (function () {
      history.images = [];
      history.save(function(err, history) {
        res.redirect('back');
      });
    })();
  }

  var public_path = __appdir + '/public';

  var images_path = {
    original: '/images/history/' + history._id + '/original/',
    thumb: '/images/history/' + history._id + '/thumb/',
  }

  mkdirp.sync(public_path + images_path.original);
  mkdirp.sync(public_path + images_path.thumb);

  post.images.path.forEach(function(item, i) {
    var image_obj = {};
    image_obj.path = post.images.path[i];
    image_obj.description = {ru:null, en:null};

    if (post.images.description.ru) {
      image_obj.description.ru = post.images.description.ru[i];
    }

    if (post.images.description.en) {
      image_obj.description.en = post.images.description.en[i];
    }

    images.push(image_obj);
  });

  async.forEachSeries(images, function(image, callback) {
    var name = Date.now();
    var original_path = images_path.original + name + '.jpg';
    var thumb_path = images_path.thumb + name + '.jpg';

    gm(public_path + image.path).resize(520, false).write(public_path + thumb_path, function() {
      gm(public_path + image.path).write(public_path + original_path, function() {
        var image_obj = {};
        image_obj.original = original_path;
        image_obj.thumb = thumb_path;
        image_obj.description = [{
          lg: 'ru',
          value: image.description.ru
        }]
        if (image.description.en) {
          image_obj.description.push({
            lg: 'en',
            value: image.description.en
          })
        }
        history.images.push(image_obj);
        callback();
      });
    });
  }, function() {
    history.save(function() {
      res.redirect('back');
    });
  });

}


// ------------------------
// *** Edit History Block ***
// ------------------------


exports.edit = function(req, res) {
  var id = req.params.id;

  History.findById(id).exec(function(err, history) {
    res.render('auth/history/edit.jade', {history: history});
  });
}

exports.edit_form = function(req, res) {
  var post = req.body;
  var id = req.params.id;

  History.findById(id).exec(function(err, history) {

    var locales = post.en ? ['ru', 'en'] : ['ru'];

    locales.forEach(function(locale) {
      checkNested(post, [locale, 'title'])
        && history.setPropertyLocalised('title', post[locale].title, locale);

      checkNested(post, [locale, 'description'])
        && history.setPropertyLocalised('description', post[locale].description, locale);
    });


    history.interval.start = new Date(Date.UTC(post.date_start.year, post.date_start.month, post.date_start.date));
    history.interval.end = new Date(Date.UTC(post.date_end.year, post.date_end.month, post.date_end.date));

    history.save(function(err, history) {
      res.redirect('/auth/history');
    });
  });
}


// ------------------------
// *** Remove History Block ***
// ------------------------


exports.remove = function(req, res) {
  var id = req.body.id;
  History.findByIdAndRemove(id, function() {
    // deleteFolderRecursive(__dirname + '/public/images/events/' + id);
    res.send('ok');
  });
}