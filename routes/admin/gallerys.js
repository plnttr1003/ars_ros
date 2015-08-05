var path = require('path');
var fs = require('fs');
var mkdirp = require('mkdirp');
var del = require('del');
var async = require('async');
var gm = require('gm').subClass({ imageMagick: true });
var del = require('del');

var Gallery = require('../../models/main.js').Gallery;

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
// *** Admin Gallerys Block ***
// ------------------------


exports.list = function(req, res) {
	Gallery.find().sort('year').exec(function(err, gallerys) {
		res.render('auth/gallerys/', {gallerys: gallerys});
	});
}


// ------------------------
// *** Add Gallerys Block ***
// ------------------------


exports.add = function(req, res) {
	res.render('auth/gallerys/add.jade');
}

exports.add_form = function(req, res) {
	var post = req.body;
	var files = req.files;

	var gallery = new Gallery();

	var locales = post.en ? ['ru', 'en'] : ['ru'];

	locales.forEach(function(locale) {

		checkNested(post, [locale, 'description'])
			&& gallery.setPropertyLocalised('description', post[locale].description, locale);
	});

	gallery.type = post.type;
	gallery.year = post.year;

	if (!files.image) {
		return (function () {
			gallery.save(function(err, gallery) {
				res.redirect('back');
			});
		})();
	}

	fs.mkdir(__appdir + '/public/images/gallerys/' + gallery._id, function() {
		var newPath = __appdir + '/public/images/gallerys/' + gallery._id;;
		gm(files.image.path).resize(1200, false).write(newPath + '/original.jpg', function() {
			gm(files.image.path).resize(400, false).write(newPath + '/thumb.jpg', function() {
				gallery.path.original = '/images/gallerys/' + gallery._id + '/logo.jpg';
				gallery.path.thumb = '/images/gallerys/' + gallery._id + '/thumb.jpg';
				gallery.save(function() {
					res.redirect('/auth/gallerys');
				});
			});
		});
	});

}


// ------------------------
// *** Edit Gallerys Block ***
// ------------------------


exports.edit = function(req, res) {
	var id = req.params.id;

	Gallery.findById(id).exec(function(err, gallery) {
		res.render('auth/gallerys/edit.jade', {gallery: gallery});
	});
}

exports.edit_form = function(req, res) {
	var id = req.params.id;
	var post = req.body;
	var files = req.files;

	Gallery.findById(id).exec(function(err, gallery) {

		var locales = post.en ? ['ru', 'en'] : ['ru'];

		locales.forEach(function(locale) {

			checkNested(post, [locale, 'description'])
				&& gallery.setPropertyLocalised('description', post[locale].description, locale);
		});

		gallery.type = post.type;
		gallery.year = post.year;

		if (!files.image) {
			return (function () {
				gallery.save(function(err, gallery) {
					res.redirect('back');
				});
			})();
		}

		fs.mkdir(__appdir + '/public/images/gallerys/' + gallery._id, function() {
			var newPath = __appdir + '/public/images/gallerys/' + gallery._id;;
			gm(files.image.path).resize(1200, false).write(newPath + '/original.jpg', function() {
				gm(files.image.path).resize(400, false).write(newPath + '/thumb.jpg', function() {
					gallery.path.original = '/images/gallerys/' + gallery._id + '/logo.jpg';
					gallery.path.thumb = '/images/gallerys/' + gallery._id + '/thumb.jpg';
					gallery.save(function() {
						res.redirect('/auth/gallerys');
					});
				});
			});
		});

	});
}


// ------------------------
// *** Remove Gallery Block ***
// ------------------------


exports.remove = function(req, res) {
	var id = req.body.id;
	Gallery.findByIdAndRemove(id, function() {
		del.sync(__appdir + '/public/images/gallerys/' + id);
		res.send('ok');
	});
}