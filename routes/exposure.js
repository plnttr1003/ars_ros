var Hall = require('../models/main.js').Hall;
var Exhibit = require('../models/main.js').Exhibit;

exports.index = function(req, res) {
	Hall.find().where('title.lg').equals(req.locale).sort('-date').exec(function(err, halls) {
		res.render('exposure', {halls: halls});
	});
}

exports.hall = function(req, res) {
	var id = req.params.id;

	Hall.findById(id).exec(function(err, hall) {
		Exhibit.where('hall').equals(hall._id).exec(function(err, exhibits) {
			res.render('exposure/hall.jade', {hall: hall, exhibits: exhibits});
		});
	});
}