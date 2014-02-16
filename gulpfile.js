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
var rimraf = require('gulp-rimraf');
var runSequence = require('run-sequence');
var reload = require('gulp-livereload');
var embedlr = require('gulp-embedlr');

var paths = {
  coffee: 'app/scripts/*.coffee',
  stylus: 'app/styles/*.styl',
  jade: 'app/index.jade'
};

var tmpDir = __dirname + '/.tmp';

gulp.task('coffee', function () {
  return gulp.src('app/scripts/app.coffee', {read: false })
    .pipe(browserify({
      transform: ['coffeeify'],
      extensions: ['.coffee']
    }))
    .pipe(concat('app.js'))
    .pipe(gulp.dest(tmpDir + '/scripts'))
    .pipe(reload());
});

gulp.task('stylus', function () {
  return gulp.src(paths.stylus)
    .pipe(stylus())
    .pipe(gulp.dest(tmpDir + '/styles'))
    .pipe(reload());
});

gulp.task('jade', function () {
  return gulp.src(paths.jade)
    .pipe(jade())
    .pipe(embedlr())
    .pipe(gulp.dest(tmpDir))
    .pipe(reload());
});

gulp.task('embed-lr', ['jade'], function () {
  return gulp.src('app/index.html')
    .pipe(gulp.dest(tmpDir));
});

gulp.task('build-styles', function () {
  return gulp.src('.tmp/styles')
    .pipe(minifyCss())
    .pipe(gulp.dest('./build/styles'));
});

gulp.task('build-scripts', function () {
  return gulp.src('.tmp/scripts')
    .pipe(uglify())
    .pipe(gulp.dest('./build/scripts'));
});

gulp.task('clean-tmp', function () {
  return gulp.src(tmpDir, { read: false })
    .pipe(rimraf({ force: true }));
});

gulp.task('server', function () {
  http.createServer(
    ecstatic({ root: tmpDir })
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
    //'embed-lr',
    'server',
    'watch',
    cb
  );
});

