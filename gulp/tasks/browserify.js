var browserify = require('browserify');
var gulp = require('gulp');
var handleErrors = require('../util/handleErrors');
var source = require('vinyl-source-stream');
var config = require('../config');

gulp.task('browserify', function(){
  return browserify({
    entries: ['./src/js/app.js']
    // if you want coffee:
    //extensions: ['.coffee', '.hbs']
  })
  .bundle({debug: true})
  .on('error', handleErrors)
  .pipe(source('main.js'))
  .pipe(gulp.dest(config.build));
});
