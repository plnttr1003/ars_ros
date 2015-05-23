var ObjectId = require('mongoose').Types.ObjectId;
var Event = require('../models/main.js').Event;
var Category = require('../models/main.js').Category;
var Exhibition = require('../models/main.js').Exhibition;


// ------------------------
// *** Handlers Block ***
// ------------------------


function toMatrix(arr, rowCount) {
	var row = 0, matrix = [], curIndex = 0;
	var rows = Math.ceil(arr.length/rowCount);

	for (var i = 0; i < arr.length; i++) {
		matrix[row] === undefined ? matrix[row] = [] : true
		matrix[row].push(arr[i]);
		row++;
		row > rowCount ? row = 0 : true
	}

	return matrix;
}


// ------------------------
// *** Schedule Block ***
// ------------------------


exports.main_redirect = function(req, res) {
	var date = new Date();
	var year = date.getFullYear();
	var month = date.getMonth();

	res.redirect('/schedule/' + year + '/' + (month + 1));
}


exports.main = function(req, res) {
	var start = new Date(Date.UTC(req.params.year, (req.params.month - 1), 1));
	var end = new Date(Date.UTC(req.params.year, (req.params.month - 1), 1));
	end.setUTCFullYear(end.getUTCFullYear(), (end.getUTCMonth() + 1), 0);
	Event.aggregate()
		// .match({'exhibition': new ObjectId(req.params.id) })
		.unwind('schedule')
		.match({
			'schedule': {
				'$gte': start,
				'$lte': end
			}
		})
		.sort({'schedule': 1})
		.group({
			'_id': {
				year: { $year: '$schedule' },
				month: { $month: '$schedule' },
				date: { $dayOfMonth: '$schedule' },
				day: { $dayOfWeek: '$schedule' }
			},
			'events': {
				$push: {
					title: '$title',
					hall: '$hall',
					age: '$age',
					time: {
						hours: { $hour: '$schedule' },
						minutes: { $minute: '$schedule' }
					}
				}
			},
			'count': { $sum: 1 }
		})
		.sort({'_id.year': 1, '_id.month': 1, '_id.date': 1})
		.exec(function(err, dates) {
			res.render('schedule/index.jade', {dates: dates, current: start});
		});
}


// ------------------------
// *** Events Block ***
// ------------------------


exports.events_redirect = function(req, res) {
	Exhibition.find().sort('-interval.start -interval.end').exec(function(err, exhibitions) {
		res.redirect('/events/' + exhibitions[0]._id);
	});
}


exports.events = function(req, res) {
	var id = req.params.id;
	Event.aggregate()
		.match({'exhibition': new ObjectId(id) })
		.unwind('categorys')
		.group({
			'_id': {
				'category': '$categorys'
			},
			'events': {
				$push: {
					title: '$title',
					description: '$description',
					hall: '$hall',
					age: '$age',
					schedule: '$schedule',
				}
			}
		})
		.project({
			'_id': 0,
			'category': '$_id.category',
			'events': '$events'
		})
		.exec(function(err, categorys) {
			Exhibition.findById(id).exec(function(err, current) {
				categorys.sort(function(a, b) {
					return current.categorys.indexOf(a.category) < current.categorys.indexOf(b.category) ? -1 : 1;
				});
				Category.populate(categorys, {path: 'category', select: 'title'}, function(err, categorys) {
					Exhibition.find().exec(function(err, exhibitions) {
						Category.populate(current, {path: 'categorys', select: 'title'}, function(err, current) {
							var columns = toMatrix(categorys, 2);
							res.render('schedule/events.jade', {columns: columns, exhibitions: exhibitions, current: current});
						});
					});
				});
			});
		});
}


// ------------------------
// *** Back Block ***
// ------------------------


exports.main_bak = function(req, res) {
	res.render('schedule/index_bak.jade');
}

exports.events_bak = function(req, res) {
	res.render('schedule/events_bak.jade');
}