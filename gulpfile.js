// Modules
var path = require('path');
var log = require('npmlog');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var browserSync = require('browser-sync');

// Gulp-related
var gulp = require('gulp');
var stylus = require('gulp-stylus');
var jade = require('gulp-jade');
var uncss = require('gulp-uncss');
var runSequence = require('run-sequence');

var buildDir = path.resolve('./build');

var config = {
  port: '8080',
  root: path.resolve('./'),
  build: {
    js: buildDir + '/js',
    css: buildDir + '/css',
    data: buildDir + '/data',
    img: buildDir + '/img'
  }
};

// Preprocessors. Jade and Stylus.
gulp.task('jade', function() {
  return gulp.src('src/jade/*.jade')
    .pipe(jade({
      pretty: true
    }))
    .pipe(gulp.dest(buildDir));
});

gulp.task('stylus', function () {
  return gulp.src('./src/styl/main.styl')
    .pipe(stylus())
    .pipe(gulp.dest(config.build.css));
});

// Package things up with browserify
gulp.task('browserify-dev', function () {
  return browserify({
    entries: ['./src/js/main.js']
  })
  .bundle({debug: true})
  .pipe(source('main.js'))
  .pipe(gulp.dest(config.build.js));
});

gulp.task('browserify-prod', function () {
  var bundler = browserify('./src/js/main.js');

  bundler.transform({
    global: true
  }, 'uglifyify');

  bundler.bundle()
    .pipe(source('main.js'))
    .pipe(gulp.dest(config.build.js));
});

gulp.task('copy-img', function() {
  return gulp.src('src/img/**')
    .pipe(gulp.dest(config.build.img));
});

gulp.task('copy-data', function() {
  return gulp.src('src/data/**')
    .pipe(gulp.dest(config.build.data));
});

gulp.task('uncss', function () {
  return gulp.src(config.build + '/main.css')
    .pipe(uncss({
      html: [config.build + '/index.html']
    }))
    .pipe(gulp.dest(buildDir));
});

gulp.task('watch', ['dev'], function(){
  gulp.watch('src/js/**', ['browserify']);
  gulp.watch('src/styl/**', ['stylus']);
  gulp.watch('src/jade/**', ['jade']);
  gulp.watch('src/images/**', ['images']);

  browserSync.init(['build/**'], {
    server: {
      baseDir: 'build'
    }
  });
});

gulp.task('default', ['watch']);

// dev build
gulp.task('dev', [
  'browserify-dev',
  'stylus',
  'jade',
  'copy-data',
  'copy-img'
]);

// production build
gulp.task('build', function (callback) {
  // do other stuff before removing unused css
  runSequence(
  ['browserify-prod', 'stylus', 'jade'],
  'uncss',
  callback
  );
})