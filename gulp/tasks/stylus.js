var gulp = require('gulp');
var stylus = require('gulp-stylus');

var config = require('../config');
var handleErrors = require('../util/handleErrors');

gulp.task('stylus', function () {
  return gulp.src('./src/styl/*.styl')
    .pipe(stylus())
    .pipe(gulp.dest(config.build))
    .on('error', handleErrors);
});
