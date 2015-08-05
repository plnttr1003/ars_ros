var async = require('async');

var Event = require('../models/main.js').Event;
var Exhibit = require('../models/main.js').Exhibit;
var Gallery = require('../models/main.js').Gallery;

function searchNormalize(search) {
	var words = search.split(' ');
	var result = [];

	for (var i = words.length - 1; i >= 0; i--) {
		var lower =  words[i].toLowerCase();
		var upper = lower.replace(lower.charAt(0), lower.charAt(0).toUpperCase());
		result.push(lower);
		result.push(upper);
	};

	return result.join('||');
}

exports.search = function(req, res) {
	var search = searchNormalize(req.body.search);

	Exhibit.find({ $text: { $search: search } }, { score : { $meta: 'textScore' } }).sort({ score : { $meta : 'textScore' } }).select('title _id').exec(function(err, exhibits) {
		Event.find({ $text: { $search: search } }, { score : { $meta: 'textScore' } }).sort({ score : { $meta : 'textScore' } }).select('title _id type').exec(function(err, events) {
			res.send({events: events, exhibits: exhibits});
		});
	});
}


exports.locale = function(req, res) {
  res.cookie('locale', req.params.locale);
  res.redirect('back');
}


exports.imageGallery = function(type) {
  return function(req, res, next) {
    Gallery.random({'type': type}, 25, 'year', function(err, images) {
    	res.locals.images = images;
    	next();
    });
  }
}