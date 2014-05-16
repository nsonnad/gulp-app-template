var gulp = require('gulp');

var log = require('../config').log;
var handleErrors = require('../util/handleErrors');

gulp.task('copy', function() {
  return gulp.src('src/htdocs/**')
    .pipe(gulp.dest('build'));
});
