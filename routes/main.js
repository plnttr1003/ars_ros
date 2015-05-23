var path = require('path');
var jade = require('jade');

var Event = require('../models/main.js').Event;
var News = require('../models/main.js').News;

var __appdir = path.dirname(require.main.filename);


exports.index = function(req, res) {
	News.find().sort('-date').limit(5).exec(function(err, news) {
		Event.find().sort('-date').limit(12).exec(function(err, events) {
			res.render('main', {events: events, news: news});
		});
	});
}

exports.get_events = function(req, res) {
	var post = req.body;

	var Query = post.context
		? Event.where('type').in(post.context)
		: Event.find();

	Query.sort('-date').skip(post.skip).limit(post.limit).exec(function(err, events) {
		var opts = {events: events, compileDebug: false, debug: false, cache: true, pretty: false};
		events.length > 0
			? res.send(jade.renderFile(__appdir + '/views/events/get_events.jade', opts))
			: res.send('out');
	});
}