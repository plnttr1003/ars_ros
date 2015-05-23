var jade = require('jade');
var path = require('path');
var async = require('async');

var Event = require('../models/main.js').Event;
var Subsidiary = require('../models/main.js').Subsidiary;
var Category = require('../models/main.js').Category;

var __appdir = path.dirname(require.main.filename);


function uniq(a) {
	a = a.map(function(item) {
		return item.toString();
	});
	uniqueArray = a.filter(function(item, pos) {
		return a.indexOf(item) == pos;
	});
	return uniqueArray;
}

exports.index = function(req, res) {
	var categorys = [];
	Event.find({type: req.params.type}).sort('-date').limit(12).exec(function(err, events) {
		async.each(events, function(event, callback) {
			categorys = categorys.concat(event.categorys);
			callback();
		}, function() {
			categorys = uniq(categorys);
			Category.where('_id').in(categorys).exec(function(err, categorys) {
				Subsidiary.find().exec(function(err, subsidiarys) {
					res.render('events', {type: req.params.type, events: events, categorys: categorys, subsidiarys: subsidiarys});
				});
			});
		});
	});
}

exports.event = function(req, res) {
	var id = req.params.id;
	Event.findById(id).exec(function(err, event) {
		res.render('events/event.jade', {event: event})
	});
}

exports.get_events = function(req, res) {
	var post = req.body;

	var Query = post.context.categorys || post.context.subsidiarys
		? Event.find({'type': post.context.type}).or([{ 'categorys': {'$in': post.context.categorys || []} }, { 'subsidiary': {'$in': post.context.subsidiarys || []} }])
		: Event.find({'type': post.context.type});

	Query.sort('-date').skip(post.skip).limit(post.limit).exec(function(err, events) {
		var opts = {events: events, compileDebug: false, debug: false, cache: true, pretty: false};
		events.length > 0
			? res.send(jade.renderFile(__appdir + '/views/events/get_events.jade', opts))
			: res.send('out');
	});
}