var path = require('path');
var fs = require('fs');
var mkdirp = require('mkdirp');
var del = require('del');
var async = require('async');
var gm = require('gm').subClass({ imageMagick: true });
var del = require('del');

var Vacancy = require('../../models/main.js').Vacancy;

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
// *** Admin vacancy Block ***
// ------------------------


exports.list = function(req, res) {
	Vacancy.find().sort('-date').exec(function(err, vacancys) {
		res.render('auth/vacancys/', {vacancys: vacancys});
	});
}


// ------------------------
// *** Add vacancy Block ***
// ------------------------


exports.add = function(req, res) {
	res.render('auth/vacancys/add.jade');
}

exports.add_form = function(req, res) {
	var post = req.body;
	var files = req.files;
	var images = [];

	var vacancy = new Vacancy();

	var locales = post.en ? ['ru', 'en'] : ['ru'];

	locales.forEach(function(locale) {
		checkNested(post, [locale, 'title'])
			&& vacancy.setPropertyLocalised('title', post[locale].title, locale);

		checkNested(post, [locale, 'description'])
			&& vacancy.setPropertyLocalised('description', post[locale].description, locale);

	});


	vacancy.date = new Date(Date.UTC(post.date.year, post.date.month, post.date.date));
	vacancy.status = post.status;

	vacancy.videos = post.videos.filter(function(n){ return n != '' });


	if (!post.images) {
		return (function () {
			vacancy.images = [];
			vacancy.save(function(err, vacancy) {
				res.redirect('back');
			});
		})();
	}

	var public_path = __appdir + '/public';

	var images_path = {
		original: '/images/vacancys/' + vacancy._id + '/original/',
		thumb: '/images/vacancys/' + vacancy._id + '/thumb/',
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
				vacancy.images.push(image_obj);
				callback();
			});
		});
	}, function() {
		vacancy.save(function() {
			res.redirect('/auth/vacancys');
		});
	});

}


// ------------------------
// *** Edit vacancy Block ***
// ------------------------


exports.edit = function(req, res) {
  var id = req.params.id;
  var public_path = __appdir + '/public';
  var preview_path = '/images/preview/';
  var images_preview = [];

	Vacancy.findById(id).exec(function(err, vacancy) {
		async.forEach(vacancy.images, function(image, callback) {
			var image_path = __appdir + '/public' + image.original;
			var image_name = image.original.split('/')[5];
			fs.createReadStream(image_path).pipe(fs.createWriteStream(public_path + preview_path + image_name));
			images_preview.push(preview_path + image_name);
			callback();
		}, function() {
			res.render('auth/vacancys/edit.jade', {images_preview: images_preview, vacancy: vacancy});
		});
	});
}


exports.edit_form = function(req, res) {
	var post = req.body;
	var files = req.files;
	var id = req.params.id;
	var images = [];


	Vacancy.findById(id).exec(function(err, vacancy) {

		var locales = post.en ? ['ru', 'en'] : ['ru'];

		locales.forEach(function(locale) {
			checkNested(post, [locale, 'title'])
				&& vacancy.setPropertyLocalised('title', post[locale].title, locale);

			checkNested(post, [locale, 'description'])
				&& vacancy.setPropertyLocalised('description', post[locale].description, locale);

		});


		vacancy.date = new Date(Date.UTC(post.date.year, post.date.month, post.date.date));
		vacancy.status = post.status;

		vacancy.videos = post.videos.filter(function(n){ return n != '' });


		var public_path = __appdir + '/public';

		var images_path = {
			original: '/images/vacancys/' + vacancy._id + '/original/',
			thumb: '/images/vacancys/' + vacancy._id + '/thumb/',
		}

		del.sync([public_path + images_path.original, public_path + images_path.thumb]);

		if (!post.images) {
			return (function () {
				vacancy.images = [];
				vacancy.save(function() {
					res.redirect('back');
				});
			})();
		}

		mkdirp.sync(public_path + images_path.original);
		mkdirp.sync(public_path + images_path.thumb);

		vacancy.images = [];

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
					vacancy.images.push(image_obj);
					callback();
				});
			});
		}, function() {
			vacancy.save(function() {
				res.redirect('back');
			})
		});


	});
}


// ------------------------
// *** Remove vacancys Block ***
// ------------------------


exports.remove = function(req, res) {
	var id = req.body.id;
	Vacancy.findByIdAndRemove(id, function() {
		del.sync(__appdir + '/public/images/vacancys/' + id);
		res.send('ok');
	});
}