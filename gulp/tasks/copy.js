var gulp = require('gulp');

var log = require('../config').log;
var handleErrors = require('../util/handleErrors');

gulp.task('copy', ['clean'], function() {
  return gulp.src('src/htdocs/**')
    .pipe(gulp.dest('build'));
});
