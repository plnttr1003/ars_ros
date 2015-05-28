var mongoose = require('mongoose');
		mongoose.connect('localhost', 'main');

var express = require('express'),
		bodyParser = require('body-parser'),
		multer = require('multer'),
		accepts = require('accepts'),
		cookieParser = require('cookie-parser'),
		session = require('express-session'),
		methodOverride = require('method-override'),
			app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.locals.pretty = true;

app.use(express.static(__dirname + '/public'));
app.use(multer({ dest: __dirname + '/uploads'}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride());
app.use(cookieParser());

var MongoStore = require('connect-mongo')(session);

app.use(session({
	key: 'sovhis.sess',
	resave: false,
	saveUninitialized: false,
	secret: 'keyboard cat',
	store: new MongoStore({ mongooseConnection: mongoose.connection }),
	cookie: {
		path: '/',
		maxAge: 1000 * 60 * 60 * 3 // 3 hours
	}
}));


app.use(function(req, res, next) {
	res.locals.session = req.session;
	res.locals.locale = req.cookies.locale || 'ru';
	next();
});


// -------------------
// *** Routes Block ***
// -------------------


var main = require('./routes/main.js');
var events = require('./routes/events.js');
var news = require('./routes/news.js');
var collects = require('./routes/collects.js');
var history = require('./routes/history.js');
var exposure = require('./routes/exposure.js');
var subsidiarys = require('./routes/subsidiarys.js');
var content = require('./routes/content.js');
var files = require('./routes/files.js');

var auth = require('./routes/auth.js');

var admin_history = require('./routes/admin/history.js');
var admin_news = require('./routes/admin/news.js');
var admin_exhibits = require('./routes/admin/exhibits.js');
var admin_collects = require('./routes/admin/collects.js');
var admin_halls = require('./routes/admin/halls.js');
var admin_subsidiarys = require('./routes/admin/subsidiarys.js');
var admin_events = require('./routes/admin/events.js');
var admin_categorys = require('./routes/admin/categorys.js');

var options = require('./routes/admin/options.js');
var globals = require('./routes/globals.js');


// ------------------------
// *** Midleware Block ***
// ------------------------



function checkAuth (req, res, next) {
	req.session.user_id ? next() : res.redirect('/login');
}



// ------------------------
// *** Main Routes Block ***
// ------------------------



// === Main Route
app.route('/')
	.get(main.index)
	.post(main.get_events);

// === Events Route
app.route('/events')
	.get(events.index)
	.post(events.get_events);

// === Events Tag Route
app.route('/events/:type').get(events.index);

// === Events Tag Route
app.route('/events/:type/:id').get(events.event);

// === News Route
app.route('/news').get(news.index);

// === News Route
app.route('/news/:id').get(news.news);

// === Exposure Route
app.route('/exposure').get(exposure.index);

// === Exposure hall Route
app.route('/exposure/:id').get(exposure.hall);

// === Collections Route
app.route('/collections').get(collects.index);

// === Collection Route
app.route('/collections/:id').get(collects.collect);

// === History Route
app.route('/history').get(history.index);

// === Subsidiarys Route
app.route('/subsidiarys').get(subsidiarys.index);

// === Subsidiary Route
app.route('/subsidiarys/:id').get(subsidiarys.subsidiary);



// ------------------------
// *** Admin History Routes Block ***
// ------------------------



// === Admin news Route
app.route('/auth/news').get(checkAuth, admin_news.list);


// === Admin @add news Route
app.route('/auth/news/add')
	 .get(checkAuth, admin_news.add)
	 .post(checkAuth, admin_news.add_form);


// === Admin @edit news Route
app.route('/auth/news/edit/:id')
	 .get(checkAuth, admin_news.edit)
	 .post(checkAuth, admin_news.edit_form);


// === Admin @remove news Route
app.route('/auth/news/remove')
	 .post(checkAuth, admin_news.remove);



// ------------------------
// *** Admin History Routes Block ***
// ------------------------



// === Admin history Route
app.route('/auth/history').get(checkAuth, admin_history.list);


// === Admin @add history Route
app.route('/auth/history/add')
	 .get(checkAuth, admin_history.add)
	 .post(checkAuth, admin_history.add_form);


// === Admin @edit history Route
app.route('/auth/history/edit/:id')
	 .get(checkAuth, admin_history.edit)
	 .post(checkAuth, admin_history.edit_form);


// === Admin @remove history Route
app.route('/auth/history/remove')
	 .post(checkAuth, admin_history.remove);



// ------------------------
// *** Admin Exhibitis Routes Block ***
// ------------------------



// === Admin exhibitis Route
app.route('/auth/exhibits').get(checkAuth, admin_exhibits.list);


// === Admin @add exhibitis Route
app.route('/auth/exhibits/add')
	 .get(checkAuth, admin_exhibits.add)
	 .post(checkAuth, admin_exhibits.add_form);


// === Admin @edit exhibitis Route
app.route('/auth/exhibits/edit/:id')
	 .get(checkAuth, admin_exhibits.edit)
	 .post(checkAuth, admin_exhibits.edit_form);


// === Admin @remove exhibitis Route
app.route('/auth/exhibits/remove')
	 .post(checkAuth, admin_exhibits.remove);



// ------------------------
// *** Admin Collects Routes Block ***
// ------------------------



// === Admin collects Route
app.route('/auth/collects').get(checkAuth, admin_collects.list);


// === Admin @add collects Route
app.route('/auth/collects/add')
	 .get(checkAuth, admin_collects.add)
	 .post(checkAuth, admin_collects.add_form);


// === Admin @edit collects Route
app.route('/auth/collects/edit/:id')
	 .get(checkAuth, admin_collects.edit)
	 .post(checkAuth, admin_collects.edit_form);


// === Admin @remove collects Route
app.route('/auth/collects/remove')
	 .post(checkAuth, admin_collects.remove);



// ------------------------
// *** Admin Halls Routes Block ***
// ------------------------



// === Admin halls Route
app.route('/auth/halls').get(checkAuth, admin_halls.list);


// === Admin @add halls Route
app.route('/auth/halls/add')
	 .get(checkAuth, admin_halls.add)
	 .post(checkAuth, admin_halls.add_form);


// === Admin @edit halls Route
app.route('/auth/halls/edit/:id')
	 .get(checkAuth, admin_halls.edit)
	 .post(checkAuth, admin_halls.edit_form);


// === Admin @remove halls Route
app.route('/auth/halls/remove')
	 .post(checkAuth, admin_halls.remove);



// ------------------------
// *** Admin Subsidiarys Routes Block ***
// ------------------------



// === Admin subsidiarys Route
app.route('/auth/subsidiarys').get(checkAuth, admin_subsidiarys.list);


// === Admin @add subsidiarys Route
app.route('/auth/subsidiarys/add')
	 .get(checkAuth, admin_subsidiarys.add)
	 .post(checkAuth, admin_subsidiarys.add_form);


// === Admin @edit subsidiarys Route
app.route('/auth/subsidiarys/edit/:id')
	 .get(checkAuth, admin_subsidiarys.edit)
	 .post(checkAuth, admin_subsidiarys.edit_form);


// === Admin @remove subsidiarys Route
app.route('/auth/subsidiarys/remove')
	 .post(checkAuth, admin_subsidiarys.remove);



// ------------------------
// *** Admin Events Routes Block ***
// ------------------------



// === Admin events Route
app.route('/auth/events').get(checkAuth, admin_events.list);


// === Admin @add events Route
app.route('/auth/events/add')
	 .get(checkAuth, admin_events.add)
	 .post(checkAuth, admin_events.add_form);


// === Admin @edit events Route
app.route('/auth/events/edit/:id')
	 .get(checkAuth, admin_events.edit)
	 .post(checkAuth, admin_events.edit_form);


// === Admin @remove events Route
app.route('/auth/events/remove')
	 .post(checkAuth, admin_events.remove);



// ------------------------
// *** Admin Categorys Routes Block ***
// ------------------------



// === Admin categorys Route
app.route('/auth/categorys').get(checkAuth, admin_categorys.list);


// === Admin @add categorys Route
app.route('/auth/categorys/add')
	 .get(checkAuth, admin_categorys.add)
	 .post(checkAuth, admin_categorys.add_form);


// === Admin @edit categorys Route
app.route('/auth/categorys/edit/:id')
	 .get(checkAuth, admin_categorys.edit)
	 .post(checkAuth, admin_categorys.edit_form);


// === Admin @remove categorys Route
app.route('/auth/categorys/remove')
	 .post(checkAuth, admin_categorys.remove);



// ------------------------
// *** Auth Routes Block ***
// ------------------------



// === Auth Route
app.route('/auth').get(checkAuth, auth.main);


// === Login Route
app.route('/login')
	 .get(auth.login)
	 .post(auth.login_form);


// === Logout Route
app.route('/logout').get(auth.logout);


// === Registr Route
app.route('/registr')
	 .get(auth.registr)
	 .post(auth.registr_form);



// ------------------------
// *** Content Routes Block ***
// ------------------------



// === About Route

// === Contacts Route
app.route('/about').get(content.contacts);





// ------------------------
// *** Options Routers Block ***
// ------------------------


app.route('/preview')
	 .post(options.preview)


// ------------------------
// *** Globals Routers Block ***
// ------------------------


// === Search Route
app.route('/search')
	 .post(globals.search)


// === Locale Route
app.route('/lang/:locale').get(globals.locale);


// ------------------------
// *** Files Routers Block ***
// ------------------------



// === Files #sitemap.xml Route
app.route('/sitemap.xml').get(files.sitemap);


// === Files #robots.txt Route
app.route('/robots.txt').get(files.robots);



// ------------------------
// *** Error Handling Block ***
// ------------------------


app.use(function(req, res, next) {
	var accept = accepts(req);
	res.status(404);

	// respond with html page
	if (accept.types('html')) {
		res.render('error', { url: req.url, status: 404 });
		return;
	}

	// respond with json
	if (accept.types('json')) {
			res.send({
			error: {
				status: 'Not found'
			}
		});
		return;
	}

	// default to plain-text
	res.type('txt').send('Not found');
});

app.use(function(err, req, res, next) {
	var status = err.status || 500;

	res.status(status);
	res.render('error', { error: err, status: status });
});


// ------------------------
// *** Connect server Block ***
// ------------------------


app.listen(process.env.PORT || 3000);
console.log('http://127.0.0.1:3000')