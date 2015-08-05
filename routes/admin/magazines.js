var path = require('path');
var fs = require('fs');
var mkdirp = require('mkdirp');
var del = require('del');
var async = require('async');
var gm = require('gm').subClass({ imageMagick: true });
var del = require('del');

var Magazine = require('../../models/main.js').Magazine;

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
// *** Admin Magazines Block ***
// ------------------------


exports.list = function(req, res) {
	Magazine.find().sort('num').exec(function(err, magazines) {
		res.render('auth/magazines/', {magazines: magazines});
	});
}


// ------------------------
// *** Add Magazine Block ***
// ------------------------


exports.add = function(req, res) {
	res.render('auth/magazines/add.jade');
}

exports.add_form = function(req, res) {
	var post = req.body;
	var files = req.files;

	var magazine = new Magazine();

	var locales = post.en ? ['ru', 'en'] : ['ru'];

	locales.forEach(function(locale) {

		checkNested(post, [locale, 'title'])
			&& magazine.setPropertyLocalised('title', post[locale].title, locale);
	});

	magazine.url = post.url;
	magazine.num = post.num;

	if (!files.image) {
		return (function () {
			magazine.save(function(err, magazine) {
				res.redirect('back');
			});
		})();
	}

	fs.mkdir(__appdir + '/public/images/magazines/' + magazine._id, function() {
		var newPath = __appdir + '/public/images/magazines/' + magazine._id;;
		gm(files.image.path).resize(1200, false).write(newPath + '/original.jpg', function() {
			gm(files.image.path).resize(400, false).write(newPath + '/thumb.jpg', function() {
				magazine.path.original = '/images/magazines/' + magazine._id + '/logo.jpg';
				magazine.path.thumb = '/images/magazines/' + magazine._id + '/thumb.jpg';
				magazine.save(function() {
					res.redirect('/auth/magazines');
				});
			});
		});
	});

}


// ------------------------
// *** Edit Magazine Block ***
// ------------------------


exports.edit = function(req, res) {
	var id = req.params.id;

	Magazine.findById(id).exec(function(err, magazine) {
		res.render('auth/magazines/edit.jade', {magazine: magazine});
	});
}

exports.edit_form = function(req, res) {
	var id = req.params.id;
	var post = req.body;
	var files = req.files;

	Magazine.findById(id).exec(function(err, magazine) {

		var locales = post.en ? ['ru', 'en'] : ['ru'];

		locales.forEach(function(locale) {

			checkNested(post, [locale, 'title'])
				&& magazine.setPropertyLocalised('title', post[locale].title, locale);
		});

		magazine.url = post.url;
		magazine.num = post.num;

		if (!files.image) {
			return (function () {
				magazine.save(function(err, magazine) {
					res.redirect('back');
				});
			})();
		}

		fs.mkdir(__appdir + '/public/images/magazines/' + magazine._id, function() {
			var newPath = __appdir + '/public/images/magazines/' + magazine._id;;
			gm(files.image.path).resize(1200, false).write(newPath + '/original.jpg', function() {
				gm(files.image.path).resize(400, false).write(newPath + '/thumb.jpg', function() {
					magazine.path.original = '/images/magazines/' + magazine._id + '/logo.jpg';
					magazine.path.thumb = '/images/magazines/' + magazine._id + '/thumb.jpg';
					magazine.save(function() {
						res.redirect('/auth/magazines');
					});
				});
			});
		});

	});
}


// ------------------------
// *** Remove Magazine Block ***
// ------------------------


exports.remove = function(req, res) {
	var id = req.body.id;
	Magazine.findByIdAndRemove(id, function() {
		del.sync(__appdir + '/public/images/magazines/' + id);
		res.send('ok');
	});
}