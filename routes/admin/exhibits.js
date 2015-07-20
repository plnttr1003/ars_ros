var path = require('path');
var fs = require('fs');
var mkdirp = require('mkdirp');
var del = require('del');
var async = require('async');
var gm = require('gm').subClass({ imageMagick: true });
var del = require('del');

var Exhibit = require('../../models/main.js').Exhibit;
var Collect = require('../../models/main.js').Collect;
var Hall = require('../../models/main.js').Hall;

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
// *** Admin Exhibits Block ***
// ------------------------


exports.list = function(req, res) {
  Exhibit.find().sort('-date').exec(function(err, exhibits) {
    res.render('auth/exhibits/', {exhibits: exhibits});
  });
}


// ------------------------
// *** Add Exhibits Block ***
// ------------------------


exports.add = function(req, res) {
  Collect.find().exec(function(err, collects) {
    Hall.find().exec(function(err, halls) {
      res.render('auth/exhibits/add.jade', {collects: collects, halls: halls});
    });
  });
}

exports.add_form = function(req, res) {
  var post = req.body;
  var files = req.files;
  var images = [];

  var exhibit = new Exhibit();

  var locales = post.en ? ['ru', 'en'] : ['ru'];

  locales.forEach(function(locale) {
    checkNested(post, [locale, 'title'])
      && exhibit.setPropertyLocalised('title', post[locale].title, locale);

    checkNested(post, [locale, 'description'])
      && exhibit.setPropertyLocalised('description', post[locale].description, locale);
  });


  exhibit.collect = post.collect != 'none' ? post.collect : undefined;
  exhibit.hall = post.hall != 'none' ? post.hall : undefined;


  if (!post.images) {
    return (function () {
      exhibit.images = [];
      exhibit.save(function(err, exhibit) {
        res.redirect('back');
      });
    })();
  }

  var public_path = __appdir + '/public';

  var images_path = {
    original: '/images/exhibits/' + exhibit._id + '/original/',
    thumb: '/images/exhibits/' + exhibit._id + '/thumb/',
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
    var name = new Date();
    name = name.getTime();
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
        exhibit.images.push(image_obj);
        callback();
      });
    });
  }, function() {
    exhibit.save(function() {
      res.redirect('back');
    });
  });

}


// ------------------------
// *** Edit Exhibits Block ***
// ------------------------


exports.edit = function(req, res) {
  var id = req.params.id;
  var public_path = __appdir + '/public';
  var preview_path = '/images/preview/';
  var images_preview = [];


  Collect.find().exec(function(err, collects) {
    Hall.find().exec(function(err, halls) {
      Exhibit.findById(id).exec(function(err, exhibit) {
        async.forEach(exhibit.images, function(image, callback) {
          var image_path = __appdir + '/public' + image.original;
          var image_name = image.original.split('/')[5];
          fs.createReadStream(image_path).pipe(fs.createWriteStream(public_path + preview_path + image_name));
          images_preview.push(preview_path + image_name);
          callback();
        }, function() {
          res.render('auth/exhibits/edit.jade', {images_preview: images_preview, exhibit: exhibit, collects: collects, halls: halls});
        });
      });
    });
  });

}

exports.edit_form = function(req, res) {
  var post = req.body;
  var files = req.files;
  var id = req.params.id;
  var images = [];

  Exhibit.findById(id).exec(function(err, exhibit) {

    var locales = post.en ? ['ru', 'en'] : ['ru'];

    locales.forEach(function(locale) {
      checkNested(post, [locale, 'title'])
        && exhibit.setPropertyLocalised('title', post[locale].title, locale);

      checkNested(post, [locale, 'description'])
        && exhibit.setPropertyLocalised('description', post[locale].description, locale);
    });


    exhibit.collect = post.collect != 'none' ? post.collect : undefined;
    exhibit.hall = post.hall != 'none' ? post.hall : undefined;


    var public_path = __appdir + '/public';

    var images_path = {
      original: '/images/exhibits/' + exhibit._id + '/original/',
      thumb: '/images/exhibits/' + exhibit._id + '/thumb/',
    }

    del.sync([public_path + images_path.original, public_path + images_path.thumb]);

    if (!post.images) {
      return (function () {
        exhibit.images = [];
        exhibit.save(function() {
          res.redirect('back');
        });
      })();
    }

    mkdirp.sync(public_path + images_path.original);
    mkdirp.sync(public_path + images_path.thumb);

    exhibit.images = [];

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
      var name = new Date();
      name = name.getTime();
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
          exhibit.images.push(image_obj);
          callback();
        });
      });
    }, function() {
      exhibit.save(function() {
        res.redirect('/auth/exhibits');
      })
    });



  });
}


// ------------------------
// *** Remove Exhibits Block ***
// ------------------------


exports.remove = function(req, res) {
  var id = req.body.id;
  Exhibit.findByIdAndRemove(id, function() {
    del.sync(__appdir + '/public/images/exhibits/' + id);
    res.send('ok');
  });
}