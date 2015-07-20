var fs = require('fs');
var path = require('path');
var touch = require('touch');

var __appdir = path.dirname(require.main.filename);

exports.edit = function(req, res) {

	var ru_path = __appdir + '/views/static/content/contacts/ru.html';
	var en_path = __appdir + '/views/static/content/contacts/en.html';

	touch.sync(ru_path);
	touch.sync(en_path);

	var ru = fs.readFileSync(ru_path);
	var en = fs.readFileSync(en_path);

	res.render('auth/contacts.jade', {content: {ru: ru, en: en}});
}

exports.edit_form = function(req, res) {
	var post = req.body;

	fs.writeFileSync(__appdir + '/views/static/content/contacts/ru.html', post.ru.content);
	if (post.en) {
		fs.writeFileSync(__appdir + '/views/static/content/contacts/en.html', post.en.content);
	}
	res.redirect('back');
}