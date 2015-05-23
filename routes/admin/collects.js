var fs = require('fs');
var path = require('path');
var gm = require('gm').subClass({ imageMagick: true });
var del = require('del');

var Collect = require('../../models/main.js').Collect;
var Exhibit = require('../../models/main.js').Exhibit;

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
// *** Admin Collects Block ***
// ------------------------


exports.list = function(req, res) {
	Collect.find().sort('-date').exec(function(err, collects) {
		res.render('auth/collects/', {collects: collects});
	});
}


// ------------------------
// *** Add Collects Block ***
// ------------------------


exports.add = function(req, res) {
	res.render('auth/collects/add.jade');
}

exports.add_form = function(req, res) {
	var post = req.body;
	var files = req.files;

	var collect = new Collect();

	var locales = post.en ? ['ru', 'en'] : ['ru'];

	locales.forEach(function(locale) {
		checkNested(post, [locale, 'title'])
			&& collect.setPropertyLocalised('title', post[locale].title, locale);

		checkNested(post, [locale, 'description'])
			&& collect.setPropertyLocalised('description', post[locale].description, locale);

	});

	if (files.logo) {
		fs.mkdir(__appdir + '/public/images/collects/' + collect._id, function() {
			var newPath = __appdir + '/public/images/collects/' + collect._id + '/logo.png';
			gm(files.logo.path).resize(520, false).write(newPath, function() {
				collect.logo.path = '/images/collects/' + collect._id + '/logo.png';
				collect.save(function(err, collect) {
					res.redirect('/auth/collects');
				});
			});
		});
	} else {
		collect.save(function(err, collect) {
			res.redirect('/auth/collects');
		});
	}
}


// ------------------------
// *** Edit Collects Block ***
// ------------------------


exports.edit = function(req, res) {
	var id = req.params.id;

	Collect.findById(id).exec(function(err, collect) {
		res.render('auth/collects/edit.jade', {collect: collect});
	});
}


exports.edit_form = function(req, res) {
	var id = req.params.id;
	var post = req.body;
	var files = req.files;


	Collect.findById(id).exec(function(err, collect) {

		var locales = post.en ? ['ru', 'en'] : ['ru'];

		locales.forEach(function(locale) {
			checkNested(post, [locale, 'title'])
				&& collect.setPropertyLocalised('title', post[locale].title, locale);

			checkNested(post, [locale, 'description'])
				&& collect.setPropertyLocalised('description', post[locale].description, locale);

		});

		if (files.logo) {
			fs.mkdir(__appdir + '/public/images/collects/' + collect._id, function() {
				var newPath = __appdir + '/public/images/collects/' + collect._id + '/logo.png';
				gm(files.logo.path).resize(520, false).write(newPath, function() {
					collect.logo.path = '/images/collects/' + collect._id + '/logo.png';
					collect.save(function(err, collect) {
						res.redirect('/auth/collects');
					});
				});
			});
		} else {
			collect.save(function(err, collect) {
				res.redirect('/auth/collects');
			});
		}
	});
}


// ------------------------
// *** Remove Collects Block ***
// ------------------------


exports.remove = function(req, res) {
	var id = req.body.id;
	Collect.findByIdAndRemove(id, function() {
		Exhibit.update({'collect': id}, {$unset: {'collect': id}}, {multi: true}).exec(function() {
			del.sync([__appdir + '/public/images/collects/' + id]);
			res.send('ok');
		});
	});
}