var fs = require('fs');
var path = require('path');
var gm = require('gm').subClass({ imageMagick: true });
var del = require('del');

var Catalogue = require('../../models/main.js').Catalogue;

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
// *** Admin Catalogues Block ***
// ------------------------


exports.list = function(req, res) {
	Catalogue.find().sort('-date').exec(function(err, catalogues) {
		res.render('auth/souvenirs/catalogues/', {catalogues: catalogues});
	});
}


// ------------------------
// *** Add Catalogues Block ***
// ------------------------


exports.add = function(req, res) {
	res.render('auth/souvenirs/catalogues/add.jade');
}

exports.add_form = function(req, res) {
	var post = req.body;
	var files = req.files;

	var catalogue = new Catalogue();

	var locales = post.en ? ['ru', 'en'] : ['ru'];

	locales.forEach(function(locale) {
		checkNested(post, [locale, 'title'])
			&& catalogue.setPropertyLocalised('title', post[locale].title, locale);

		checkNested(post, [locale, 'description'])
			&& catalogue.setPropertyLocalised('description', post[locale].description, locale);

	});

	if (files.logo) {
		fs.mkdir(__appdir + '/public/images/catalogues/' + catalogue._id, function() {
			var newPath = __appdir + '/public/images/catalogues/' + catalogue._id + '/logo.png';
			gm(files.logo.path).resize(520, false).write(newPath, function() {
				catalogue.logo.path = '/images/catalogues/' + catalogue._id + '/logo.png';
				catalogue.save(function(err, catalogue) {
					res.redirect('/auth/catalogues');
				});
			});
		});
	} else {
		catalogue.save(function(err, catalogue) {
			res.redirect('/auth/catalogues');
		});
	}
}


// ------------------------
// *** Edit Catalogues Block ***
// ------------------------


exports.edit = function(req, res) {
	var id = req.params.id;

	Catalogue.findById(id).exec(function(err, catalogue) {
		res.render('auth/souvenirs/catalogues/edit.jade', {catalogue: catalogue});
	});
}


exports.edit_form = function(req, res) {
	var id = req.params.id;
	var post = req.body;
	var files = req.files;


	Catalogue.findById(id).exec(function(err, catalogue) {

		var locales = post.en ? ['ru', 'en'] : ['ru'];

		locales.forEach(function(locale) {
			checkNested(post, [locale, 'title'])
				&& catalogue.setPropertyLocalised('title', post[locale].title, locale);

			checkNested(post, [locale, 'description'])
				&& catalogue.setPropertyLocalised('description', post[locale].description, locale);

		});

		if (files.logo) {
			fs.mkdir(__appdir + '/public/images/catalogues/' + catalogue._id, function() {
				var newPath = __appdir + '/public/images/catalogues/' + catalogue._id + '/logo.png';
				gm(files.logo.path).resize(520, false).write(newPath, function() {
					catalogue.logo.path = '/images/catalogues/' + catalogue._id + '/logo.png';
					catalogue.save(function(err, catalogue) {
						res.redirect('/auth/catalogues');
					});
				});
			});
		} else {
			catalogue.save(function(err, catalogue) {
				res.redirect('/auth/catalogues');
			});
		}
	});
}


// ------------------------
// *** Remove Catalogues Block ***
// ------------------------


exports.remove = function(req, res) {
	var id = req.body.id;
	Catalogue.findByIdAndRemove(id, function() {
		Souvenir.update({'catalogue': id}, {$unset: {'catalogue': id}}, {multi: true}).exec(function() {
			del.sync([__appdir + '/public/images/catalogues/' + id]);
			res.send('ok');
		});
	});
}