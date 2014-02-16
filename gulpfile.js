var gulp = require('gulp');
var http = require('http');
var fs = require('fs');

var stylus = require('gulp-stylus');
var jade = require('gulp-jade');
var browserify = require('gulp-browserify');
var concat = require('gulp-concat');
var ecstatic = require('ecstatic');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-minify-css');
var runSequence = require('run-sequence');
var reload = require('gulp-livereload');
var embedlr = require('gulp-embedlr');
var clean = require('gulp-clean');

var paths = {
  coffee: 'app/scripts/*.coffee',
  stylus: 'app/styles/*.styl',
  jade: 'app/index.jade',
  app: __dirname + '/app',
  tmp: __dirname + '/.tmp',
  build: __dirname + '/build'
};

gulp.task('coffee', function () {
  return gulp.src(paths.app + '/scripts/app.coffee', {read: false })
    .pipe(browserify({
      transform: ['coffeeify'],
      extensions: ['.coffee']
    }))
    .pipe(concat('app.js'))
    .pipe(gulp.dest(paths.tmp + '/scripts'))
    .pipe(reload());
});

gulp.task('stylus', function () {
  return gulp.src(paths.stylus)
    .pipe(stylus())
    .pipe(gulp.dest(paths.tmp + '/styles'))
    .pipe(reload());
});

gulp.task('jade', function () {
  return gulp.src(paths.jade)
    .pipe(jade())
    .pipe(gulp.dest(paths.tmp))
    .pipe(reload());
});

gulp.task('embed-lr', ['jade'], function () {
  return gulp.src(paths.tmp + '/index.html')
    .pipe(embedlr())
    .pipe(gulp.dest(paths.tmp));
});

gulp.task('build-styles', function () {
  return gulp.src('.tmp/styles')
    .pipe(minifyCss())
    .pipe(gulp.dest(paths.build + '/styles'));
});

gulp.task('build-scripts', function () {
  return gulp.src('.tmp/scripts')
    .pipe(uglify())
    .pipe(gulp.dest(paths.build + '/scripts'));
});

gulp.task('build-html', function () {
  return gulp.src('.tmp/*.html')
    .pipe(gulp.dest(paths.build));
});

gulp.task('clean-tmp', function () {
  return gulp.src(paths.tmp, { read: false })
    .pipe(clean({ force: true }));
});

gulp.task('clean-build', function () {
  return gulp.src(paths.build, { read: false })
    .pipe(clean({ force: true }));
});

gulp.task('server', function () {
  http.createServer(
    ecstatic({ root: paths.tmp })
  ).listen(8080);
  console.log('Listening on 8080...');
});

gulp.task('watch', function () {
  gulp.watch(paths.coffee, ['coffee']);
  gulp.watch(paths.stylus, ['stylus']);
  gulp.watch(paths.jade, ['jade']);
  console.log('Watching for changes...');
});

gulp.task('default', function (cb) {
  runSequence(
    'clean-tmp',
    ['coffee', 'stylus', 'jade'],
    'embed-lr',
    'server',
    'watch',
    cb
  );
});

gulp.task('build', function (cb) {
  runSequence(
    'clean-tmp',
    'clean-build',
    ['coffee', 'stylus', 'jade'],
    ['build-scripts', 'build-styles', 'build-html'],
    cb
  );
});

