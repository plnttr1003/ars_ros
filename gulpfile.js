var gulp = require('gulp'),
		nodemon = require('gulp-nodemon'),
		autoprefixer = require('gulp-autoprefixer'),
		uglify = require('gulp-uglify'),
		stylus = require('gulp-stylus'),
		jshint = require('gulp-jshint');


var paths = {
	stylus: {
		src: ['public/src/styl/*.styl'],
		dest: 'public/build/css'
	},
	client_js: {
		src: ['public/src/js/*.js'],
		dest: 'public/build/js'
	},
	nodemon: {
		ignore: ['public/*']
	}
}


gulp.task('nodemon', function() {
	nodemon({ script: 'app.js', ext: 'js', ignore: paths.nodemon.ignore })
});

gulp.task('stylus', function () {
	gulp.src(paths.stylus.src)
			.pipe(stylus({
				compress: true
			}))
			.pipe(autoprefixer({
				browsers: ['last 2 versions'],
				cascade: true
			}))
			.pipe(gulp.dest(paths.stylus.dest));
});

gulp.task('watch_stylus', function () {
	var watcher = gulp.watch(paths.stylus.src, ['stylus']);

	watcher.on('change', function(event) {
		console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
	});
});

gulp.task('js', function () {
	gulp.src(paths.client_js.src)
			.pipe(jshint())
			.pipe(jshint.reporter('jshint-stylish'))
			.pipe(uglify())
			.pipe(gulp.dest(paths.client_js.dest));
});

gulp.task('watch_js', function () {
	var watcher = gulp.watch(paths.client_js.src, ['js']);

	watcher.on('change', function(event) {
		console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
	});
});

gulp.task('default', ['stylus', 'js']);
gulp.task('dev', ['watch_stylus', 'watch_js', 'nodemon']);