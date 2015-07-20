var Catalogue = require('../models/main.js').Catalogue;
var Souvenir = require('../models/main.js').Souvenir;

exports.index = function(req, res) {
	Catalogue.find().where('title.lg').equals(req.locale).sort('-date').exec(function(err, catalogues) {
		var ids = catalogues.map(function(catalogue) {
			return catalogue._id.toString();
		});
		Souvenir.where('catalogue').in(ids).limit(10).exec(function(err, souvenirs) {
			res.render('souvenirs', {catalogues: catalogues, souvenirs: souvenirs});
		});
	});
}

exports.catalogue = function(req, res) {
	var id = req.params.id;

	Souvenir.find({'catalogue': id}).where('title.lg').equals(req.locale).exec(function(err, souvenirs) {
		Catalogue.findById(id).exec(function(err, catalogue) {
			res.render('souvenirs/catalogue.jade', {souvenirs: souvenirs, catalogue: catalogue});
		});
	});
}