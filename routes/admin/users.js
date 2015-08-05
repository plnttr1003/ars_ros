var User = require('../../models/main.js').User;


// ------------------------
// *** Admin Users Block ***
// ------------------------


exports.list = function(req, res) {
  var Query = req.session.status == 'Admin'
    ? User.find().sort('-date')
    : User.find({'_id': req.session.user_id}).sort('-date');

  Query.exec(function(err, users) {
    res.render('auth/users/', {users: users});
  });
}


// ------------------------
// *** Add Users Block ***
// ------------------------


exports.add = function(req, res) {
  if (req.session.status == 'Admin') {
    res.render('auth/users/add.jade');
  } else {
    res.redirect('back');
  }
}

exports.add_form = function(req, res) {
  var post = req.body;

  var user = new User();

  user.login = post.login;
  user.password = post.password;
  user.email = post.email;
  user.status = post.status;

  user.save(function(err, user) {
    res.redirect('/auth/users');
  });
}


// ------------------------
// *** Edit Users Block ***
// ------------------------


exports.edit = function(req, res) {
  var id = req.params.id;

  User.findById(id).exec(function(err, user) {
    res.render('auth/users/edit.jade', {user: user});
  });
}

exports.edit_form = function(req, res) {
  var post = req.body;
  var id = req.params.id;

  User.findById(id).exec(function(err, user) {

    user.login = post.login;
    if (post.password != '') {
      user.password = post.password;
    }
    user.email = post.email;
    user.status = post.status;

    user.save(function(err, user) {
      res.redirect('/auth/users');
    });
  });
}


// ------------------------
// *** Remove Users Block ***
// ------------------------


exports.remove = function(req, res) {
  var id = req.body.id;

  User.findByIdAndRemove(id, function() {
    res.send('ok');
  });
}