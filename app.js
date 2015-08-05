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

var MongoStore = require('connect-mongo')(session);
var i18n = require('i18n');

i18n.configure({
	locales: ['ru', 'en'],
	defaultLocale: 'ru',
	cookie: 'locale',
	directory: __dirname + '/locales'
});

app.use(express.static(__dirname + '/public'));
app.use(multer({ dest: __dirname + '/uploads', includeEmptyFields: true}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride());
app.use(cookieParser());
app.use(i18n.init);

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
	req.locale = req.cookies.locale || 'ru';
	next();
});


// -------------------
// *** Routes Block ***
// -------------------


var main = require('./routes/main.js');
var events = require('./routes/events.js');
var news = require('./routes/news.js');
var vacancys = require('./routes/vacancys.js');
var collects = require('./routes/collects.js');
var history = require('./routes/history.js');
var exposure = require('./routes/exposure.js');
var subsidiarys = require('./routes/subsidiarys.js');
var souvenirs = require('./routes/souvenirs.js');
var magazines = require('./routes/magazines.js');
var content = require('./routes/content.js');
var files = require('./routes/files.js');

var auth = require('./routes/auth.js');

var admin_users = require('./routes/admin/users.js');
var admin_history = require('./routes/admin/history.js');
var admin_news = require('./routes/admin/news.js');
var admin_vacancys = require('./routes/admin/vacancys.js');
var admin_exhibits = require('./routes/admin/exhibits.js');
var admin_collects = require('./routes/admin/collects.js');
var admin_halls = require('./routes/admin/halls.js');
var admin_subsidiarys = require('./routes/admin/subsidiarys.js');
var admin_events = require('./routes/admin/events.js');
var admin_categorys = require('./routes/admin/categorys.js');
var admin_catalogues= require('./routes/admin/catalogues.js');
var admin_souvenirs = require('./routes/admin/souvenirs.js');
var admin_magazines = require('./routes/admin/magazines.js');

var admin_official = require('./routes/admin/official.js');
var admin_contacts = require('./routes/admin/contacts.js');
var admin_schedule = require('./routes/admin/schedule.js');
var admin_gallerys = require('./routes/admin/gallerys.js');

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
	.get(globals.imageGallery('main'), main.index)
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
app.route('/news')
	.get(globals.imageGallery('main'), news.index)
	.post(news.get_news);

// === News Route
app.route('/news/:id').get(news.news);


// === Officials Route
app.route('/official')
	.get(content.official)


// === Vacancys Route
app.route('/vacancys')
	.get(globals.imageGallery('main'), vacancys.index)
	.post(vacancys.vacancys);

// === Vacancys Route
app.route('/vacancys/:id').get(globals.imageGallery('main'), vacancys.vacancys);

// === Magazines Route
app.route('/magazines')
	.get(globals.imageGallery('main'), magazines.index)
	.post(magazines.get_magazines)

// === Magazine Route
app.route('/magazines/:id').get(magazines.magazine)

// === Exposure Route
app.route('/exposure').get(globals.imageGallery('main'), exposure.index);

// === Exposure hall Route
app.route('/exposure/:id').get(exposure.hall);

// === Collections Route
app.route('/collections').get(collects.index);

// === Collection Route
app.route('/collections/:id').get(collects.collect);

// === History Route
app.route('/history').get(globals.imageGallery('history'), history.index);

// === Subsidiarys Route
app.route('/subsidiarys').get(subsidiarys.index);

// === Subsidiary Route
app.route('/subsidiarys/:id').get(subsidiarys.subsidiary);

// === Souvenirs Route
app.route('/souvenirs').get(souvenirs.index);

// === Souvenir Route
app.route('/souvenirs/:id').get(souvenirs.catalogue);


// ------------------------
// *** Admin Users Routes Block ***
// ------------------------



// === Admin users Route
app.route('/auth/users').get(checkAuth, admin_users.list);


// === Admin @add users Route
app.route('/auth/users/add')
	 .get(checkAuth, admin_users.add)
	 .post(checkAuth, admin_users.add_form);


// === Admin @edit users Route
app.route('/auth/users/edit/:id')
	 .get(checkAuth, admin_users.edit)
	 .post(checkAuth, admin_users.edit_form);


// === Admin @remove users Route
app.route('/auth/users/remove')
	 .post(checkAuth, admin_users.remove);



// ------------------------
// *** Admin News Routes Block ***
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
// *** Admin Vacancys Routes Block ***
// ------------------------


// === Admin vacancys Route
app.route('/auth/vacancys').get(checkAuth, admin_vacancys.list);


// === Admin @add vacancys Route
app.route('/auth/vacancys/add')
	 .get(checkAuth, admin_vacancys.add)
	 .post(checkAuth, admin_vacancys.add_form);


// === Admin @edit vacancys Route
app.route('/auth/vacancys/edit/:id')
	 .get(checkAuth, admin_vacancys.edit)
	 .post(checkAuth, admin_vacancys.edit_form);


// === Admin @remove vacancys Route
app.route('/auth/vacancys/remove')
	 .post(checkAuth, admin_vacancys.remove);



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
// *** Admin Catalogues Routes Block ***
// ------------------------


// === Admin catalogues Route
app.route('/auth/catalogues').get(checkAuth, admin_catalogues.list);


// === Admin @add catalogues Route
app.route('/auth/catalogues/add')
	 .get(checkAuth, admin_catalogues.add)
	 .post(checkAuth, admin_catalogues.add_form);


// === Admin @edit catalogues Route
app.route('/auth/catalogues/edit/:id')
	 .get(checkAuth, admin_catalogues.edit)
	 .post(checkAuth, admin_catalogues.edit_form);


// === Admin @remove catalogues Route
app.route('/auth/catalogues/remove')
	 .post(checkAuth, admin_catalogues.remove);


// ------------------------
// *** Admin Souvenirs Routes Block ***
// ------------------------


// === Admin souvenirs Route
app.route('/auth/catalogues/edit/:id/souvenirs').get(checkAuth, admin_souvenirs.list);


// === Admin @add souvenirs Route
app.route('/auth/catalogues/edit/:id/souvenirs/add')
	 .get(checkAuth, admin_souvenirs.add)
	 .post(checkAuth, admin_souvenirs.add_form);


// === Admin @edit souvenirs Route
app.route('/auth/catalogues/edit/:id/souvenirs/edit/:souvenir_id')
	 .get(checkAuth, admin_souvenirs.edit)
	 .post(checkAuth, admin_souvenirs.edit_form);


// === Admin @remove souvenirs Route
app.route('/auth/catalogues/edit/:id/souvenirs/edit/:souvenir_id/remove')
	 .post(checkAuth, admin_souvenirs.remove);


// ------------------------
// *** Admin Gallerys Routes Block ***
// ------------------------



// === Admin gallerys Route
app.route('/auth/gallerys').get(checkAuth, admin_gallerys.list);


// === Admin @add gallerys Route
app.route('/auth/gallerys/add')
	 .get(checkAuth, admin_gallerys.add)
	 .post(checkAuth, admin_gallerys.add_form);


// === Admin @edit gallerys Route
app.route('/auth/gallerys/edit/:id')
	 .get(checkAuth, admin_gallerys.edit)
	 .post(checkAuth, admin_gallerys.edit_form);


// === Admin @remove gallerys Route
app.route('/auth/gallerys/remove')
	 .post(checkAuth, admin_gallerys.remove);


// ------------------------
// *** Admin Magazines Routes Block ***
// ------------------------



// === Admin magazines Route
app.route('/auth/magazines').get(checkAuth, admin_magazines.list);


// === Admin @add magazines Route
app.route('/auth/magazines/add')
	 .get(checkAuth, admin_magazines.add)
	 .post(checkAuth, admin_magazines.add_form);


// === Admin @edit magazines Route
app.route('/auth/magazines/edit/:id')
	 .get(checkAuth, admin_magazines.edit)
	 .post(checkAuth, admin_magazines.edit_form);


// === Admin @remove magazines Route
app.route('/auth/magazines/remove')
	 .post(checkAuth, admin_magazines.remove);


// ------------------------
// *** Admin Contacts Content ***
// ------------------------


app.route('/auth/contacts')
	 .get(checkAuth, admin_contacts.edit)
	 .post(checkAuth, admin_contacts.edit_form);

app.route('/auth/official')
	 .get(checkAuth, admin_official.edit)
	 .post(checkAuth, admin_official.edit_form);

app.route('/auth/schedule')
	 .get(checkAuth, admin_schedule.edit)
	 .post(checkAuth, admin_schedule.edit_form);


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


// === Team Route
app.route('/team').get(content.team);

// === Partners Route
app.route('/partners').get(globals.imageGallery('main'), content.partners);

// === Schedule Route
app.route('/schedule').get(globals.imageGallery('main'), content.schedule);

// === Contacts Route
app.route('/contacts').get(content.contacts);

// === Official Route
app.route('/official').get(content.contacts);



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


// app.use(function(req, res, next) {
// 	var accept = accepts(req);
// 	res.status(404);

// 	// respond with html page
// 	if (accept.types('html')) {
// 		res.render('error', { url: req.url, status: 404 });
// 		return;
// 	}

// 	// respond with json
// 	if (accept.types('json')) {
// 			res.send({
// 			error: {
// 				status: 'Not found'
// 			}
// 		});
// 		return;
// 	}

// 	// default to plain-text
// 	res.type('txt').send('Not found');
// });

// app.use(function(err, req, res, next) {
// 	var status = err.status || 500;

// 	res.status(status);
// 	res.render('error', { error: err, status: status });
// });


// ------------------------
// *** Connect server Block ***
// ------------------------


app.listen(process.env.PORT || 3000);
console.log('http://127.0.0.1:3000')