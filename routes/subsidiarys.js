var Subsidiary = require('../models/main.js').Subsidiary;

exports.index = function(req, res) {
	Subsidiary.find().where('title.lg').equals(req.locale).sort('date').exec(function(err, subsidiarys) {
		res.render('subsidiarys', {subsidiarys: subsidiarys});
	});
}

exports.subsidiary = function(req, res) {
	var id = req.params.id;

	Subsidiary.findById(id).exec(function(err, subsidiary) {
		res.render('subsidiarys/subsidiary.jade', {subsidiary: subsidiary});
	});
}