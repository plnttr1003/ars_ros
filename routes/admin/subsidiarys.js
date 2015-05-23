var path = require('path');
var fs = require('fs');
var mkdirp = require('mkdirp');
var del = require('del');
var async = require('async');
var gm = require('gm').subClass({ imageMagick: true });
var del = require('del');

var Subsidiary = require('../../models/main.js').Subsidiary;
var Event = require('../../models/main.js').Event;
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
// *** Admin Subsidiarys Block ***
// ------------------------


exports.list = function(req, res) {
	Subsidiary.find().exec(function(err, subsidiarys) {
		res.render('auth/subsidiarys/', {subsidiarys: subsidiarys});
	});
}


// ------------------------
// *** Add Subsidiarys Block ***
// ------------------------


exports.add = function(req, res) {
	res.render('auth/subsidiarys/add.jade');
}

exports.add_form = function(req, res) {
	var post = req.body;
	var files = req.files;
	var images = [];

	var subsidiary = new Subsidiary();

	var locales = post.en ? ['ru', 'en'] : ['ru'];

	locales.forEach(function(locale) {
		checkNested(post, [locale, 'title'])
			&& subsidiary.setPropertyLocalised('title', post[locale].title, locale);

		checkNested(post, [locale, 'adress'])
			&& subsidiary.setPropertyLocalised('adress', post[locale].adress, locale);

		checkNested(post, [locale, 'description'])
			&& subsidiary.setPropertyLocalised('description', post[locale].description, locale);
	});


	if (files.logo) {
		fs.mkdir(__appdir + '/public/images/subsidiarys/' + subsidiary._id, function() {
			var newPath = __appdir + '/public/images/subsidiarys/' + subsidiary._id + '/logo.png';
			gm(files.logo.path).resize(280, false).write(newPath, function() {
				subsidiary.logo.path = '/images/subsidiarys/' + subsidiary._id + '/logo.png';
			});
		});
	}

	subsidiary.logo.position.x = post.position.x || 0;
	subsidiary.logo.position.y = post.position.y || 0;


	if (!post.images) {
		return (function () {
			subsidiary.images = [];
			subsidiary.save(function(err, subsidiary) {
				res.redirect('back');
			});
		})();
	}

	var public_path = __appdir + '/public';

	var images_path = {
		original: '/images/subsidiarys/' + subsidiary._id + '/original/',
		thumb: '/images/subsidiarys/' + subsidiary._id + '/thumb/',
	}

	mkdirp.sync(public_path + images_path.original);
	mkdirp.sync(public_path + images_path.thumb);

	post.images.path.forEach(function(item, i) {
		images.push({
			path: post.images.path[i],
			description: post.images.description[i]
		});
	});

	async.forEachSeries(images, function(image, callback) {
		var name = new Date();
		name = name.getTime();
		var original_path = images_path.original + name + '.jpg';
		var thumb_path = images_path.thumb + name + '.jpg';

		gm(public_path + image.path).resize(300, false).write(public_path + thumb_path, function() {
			gm(public_path + image.path).write(public_path + original_path, function() {
				subsidiary.images.push({
					original: original_path,
					thumb: thumb_path,
					description: [{
						lg: 'ru',
						value: image.description
					}]
				});
				callback();
			});
		});
	}, function() {
		subsidiary.save(function() {
			res.redirect('/auth/subsidiarys');
		});
	});

}


// ------------------------
// *** Edit Subsidiarys Block ***
// ------------------------


exports.edit = function(req, res) {
	var id = req.params.id;
	var public_path = __appdir + '/public';
	var preview_path = '/images/preview/';
	var images_preview = [];

	Subsidiary.findById(id).exec(function(err, subsidiary) {
		async.forEach(subsidiary.images, function(image, callback) {
			var image_path = __appdir + '/public' + image.original;
			var image_name = image.original.split('/')[5];
			fs.createReadStream(image_path).pipe(fs.createWriteStream(public_path + preview_path + image_name));
			images_preview.push(preview_path + image_name);
			callback();
		}, function() {
			res.render('auth/subsidiarys/edit.jade', {images_preview: images_preview, subsidiary: subsidiary});
		});
	});
}

exports.edit_form = function(req, res) {
	var post = req.body;
	var files = req.files;
	var id = req.params.id;
	var images = [];

	Subsidiary.findById(id).exec(function(err, subsidiary) {

		var locales = post.en ? ['ru', 'en'] : ['ru'];

		locales.forEach(function(locale) {
			checkNested(post, [locale, 'title'])
				&& subsidiary.setPropertyLocalised('title', post[locale].title, locale);

			checkNested(post, [locale, 'adress'])
				&& subsidiary.setPropertyLocalised('adress', post[locale].adress, locale);

			checkNested(post, [locale, 'description'])
				&& subsidiary.setPropertyLocalised('description', post[locale].description, locale);
		});

		subsidiary.logo.position.x = post.position.x || 0;
		subsidiary.logo.position.y = post.position.y || 0;

		if (files.logo) {
			fs.mkdir(__appdir + '/public/images/subsidiarys/' + subsidiary._id, function() {
				var newPath = __appdir + '/public/images/subsidiarys/' + subsidiary._id + '/logo.png';
				gm(files.logo.path).resize(280, false).write(newPath, function() {
					subsidiary.logo.path = '/images/subsidiarys/' + subsidiary._id + '/logo.png';
				});
			});
		}

		var public_path = __appdir + '/public';

		var images_path = {
			original: '/images/subsidiarys/' + subsidiary._id + '/original/',
			thumb: '/images/subsidiarys/' + subsidiary._id + '/thumb/',
		}

		del.sync([public_path + images_path.original, public_path + images_path.thumb]);

		if (!post.images) {
			return (function () {
				subsidiary.images = [];
				subsidiary.save(function() {
					res.redirect('back');
				});
			})();
		}

		mkdirp.sync(public_path + images_path.original);
		mkdirp.sync(public_path + images_path.thumb);

		subsidiary.images = [];

		post.images.path.forEach(function(item, i) {
			images.push({
				path: post.images.path[i],
				description: post.images.description[i]
			});
		});

		async.forEachSeries(images, function(image, callback) {
			var name = new Date();
			name = name.getTime();
			var original_path = images_path.original + name + '.jpg';
			var thumb_path = images_path.thumb + name + '.jpg';

			gm(public_path + image.path).resize(300, false).write(public_path + thumb_path, function() {
				gm(public_path + image.path).write(public_path + original_path, function() {
					subsidiary.images.push({
						original: original_path,
						thumb: thumb_path,
						description: [{
							lg: 'ru',
							value: image.description
						}]
					});
					callback();
				});
			});
		}, function() {
			subsidiary.save(function() {
				res.redirect('back');
			})
		});


	});
}


// ------------------------
// *** Remove Subsidiarys Block ***
// ------------------------


exports.remove = function(req, res) {
	var id = req.body.id;
	Subsidiary.findByIdAndRemove(id, function() {
		Event.update({ 'subsidiary': id }, { $unset: { 'subsidiary': id } }, {multi: true}).exec(function() {
			Hall.update({ 'subsidiary': id }, { $unset: { 'subsidiary': id } }, {multi: true}).exec(function() {
				del.sync(__appdir + '/public/images/subsidiarys/' + id);
				res.send('ok');
			});
		});
	});
}