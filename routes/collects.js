var Collect = require('../models/main.js').Collect;
var Exhibit = require('../models/main.js').Exhibit;

exports.index = function(req, res) {
	Collect.find().where('title.lg').equals(req.locale).sort('-date').exec(function(err, collects) {
		var ids = collects.map(function(collect) {
			return collect._id.toString();
		});
		Exhibit.where('collect').in(ids).limit(10).exec(function(err, exhibits) {
			res.render('collects', {collects: collects, exhibits: exhibits});
		});
	});
}

exports.collect = function(req, res) {
	var id = req.params.id;

	Exhibit.find({'collect': id}).where('title.lg').equals(req.locale).exec(function(err, exhibits) {
		Collect.findById(id).exec(function(err, collect) {
			res.render('collects/collect.jade', {exhibits: exhibits, collect: collect});
		});
	});
}