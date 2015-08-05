var path = require('path');
var fs = require('fs');
var mkdirp = require('mkdirp');
var del = require('del');
var async = require('async');
var gm = require('gm').subClass({ imageMagick: true });
var del = require('del');

var Event = require('../../models/main.js').Event;
var Category = require('../../models/main.js').Category;
var Subsidiary = require('../../models/main.js').Subsidiary;

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
// *** Admin Events Block ***
// ------------------------


exports.list = function(req, res) {
	Event.find().sort('-date').exec(function(err, events) {
		Event.distinct('categorys').exec(function(err, categorys) {
			Category.where('_id').in(categorys).exec(function(err, categorys) {
				res.render('auth/events/', {events: events, categorys: categorys});
			});
		});
	});
}


// ------------------------
// *** Add Events Block ***
// ------------------------


exports.add = function(req, res) {
	Subsidiary.find().exec(function(err, subsidiarys) {
		Category.find().exec(function(err, categorys) {
			res.render('auth/events/add.jade', {subsidiarys: subsidiarys, categorys: categorys});
		});
	});
}

exports.add_form = function(req, res) {
	var post = req.body;
	var files = req.files;
	var images = [];

	var event = new Event();

	var locales = post.en ? ['ru', 'en'] : ['ru'];

	locales.forEach(function(locale) {
		checkNested(post, [locale, 'title'])
			&& event.setPropertyLocalised('title', post[locale].title, locale);

		checkNested(post, [locale, 'description'])
			&& event.setPropertyLocalised('description', post[locale].description, locale);
	});

	event.category = post.category;
	event.type = post.type;
	event.status = post.status;
	event.subsidiary = post.subsidiary != 'none' ? post.subsidiary : undefined;
	event.categorys = post.categorys == '' ? [] : post.categorys;

	event.videos = post.videos.filter(function(n){ return n != '' });

	event.interval.start = new Date(Date.UTC(post.date_start.year, post.date_start.month, post.date_start.date));
	event.interval.end = new Date(Date.UTC(post.date_end.year, post.date_end.month, post.date_end.date));
	event.interval.hidden = post.date_hidden;

	event.date = new Date(Date.UTC(post.date.year, post.date.month, post.date.date));

	if (!post.images) {
		return (function () {
			event.images = [];
			event.save(function(err, event) {
				res.redirect('back');
			});
		})();
	}

	var public_path = __appdir + '/public';

	var images_path = {
		original: '/images/events/' + event._id + '/original/',
		thumb: '/images/events/' + event._id + '/thumb/',
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
				event.images.push(image_obj);
				callback();
			});
		});
	}, function() {
		event.save(function() {
			res.redirect('/auth/events');
		});
	});

}


// ------------------------
// *** Edit Events Block ***
// ------------------------


exports.edit = function(req, res) {
  var id = req.params.id;
  var public_path = __appdir + '/public';
  var preview_path = '/images/preview/';
  var images_preview = [];

	Subsidiary.find().exec(function(err, subsidiarys) {
		Category.find().exec(function(err, categorys) {
			Event.findById(id).exec(function(err, event) {
				async.forEach(event.images, function(image, callback) {
					var image_path = __appdir + '/public' + image.original;
					var image_name = image.original.split('/')[5];
					fs.createReadStream(image_path).pipe(fs.createWriteStream(public_path + preview_path + image_name));
					images_preview.push(preview_path + image_name);
					callback();
				}, function() {
					res.render('auth/events/edit.jade', {images_preview: images_preview, event: event, subsidiarys: subsidiarys, categorys: categorys});
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

	Event.findById(id).exec(function(err, event) {

		var locales = post.en ? ['ru', 'en'] : ['ru'];

		locales.forEach(function(locale) {
			checkNested(post, [locale, 'title'])
				&& event.setPropertyLocalised('title', post[locale].title, locale);

			checkNested(post, [locale, 'description'])
				&& event.setPropertyLocalised('description', post[locale].description, locale);
		});

		event.category = post.category;
		event.type = post.type;
		event.status = post.status;
		event.subsidiary = post.subsidiary != 'none' ? post.subsidiary : undefined;
		event.categorys = post.categorys == '' ? [] : post.categorys;

		event.videos = post.videos.filter(function(n){ return n != '' });

		event.interval.start = new Date(Date.UTC(post.date_start.year, post.date_start.month, post.date_start.date));
		event.interval.end = new Date(Date.UTC(post.date_end.year, post.date_end.month, post.date_end.date));
		event.interval.hidden = post.date_hidden;

		event.date = new Date(Date.UTC(post.date.year, post.date.month, post.date.date));

		var public_path = __appdir + '/public';

		var images_path = {
			original: '/images/events/' + event._id + '/original/',
			thumb: '/images/events/' + event._id + '/thumb/',
		}

		del.sync([public_path + images_path.original, public_path + images_path.thumb]);

		if (!post.images) {
			return (function () {
				event.images = [];
				event.save(function() {
					res.redirect('back');
				});
			})();
		}

		mkdirp.sync(public_path + images_path.original);
		mkdirp.sync(public_path + images_path.thumb);

		event.images = [];

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
					event.images.push(image_obj);
					callback();
				});
			});
		}, function() {
			event.save(function() {
				res.redirect('back');
			})
		});





	});
}


// ------------------------
// *** Remove Events Block ***
// ------------------------


exports.remove = function(req, res) {
	var id = req.body.id;
	Event.findByIdAndRemove(id, function() {
		del.sync(__appdir + '/public/images/events/' + id);
		res.send('ok');
	});
}