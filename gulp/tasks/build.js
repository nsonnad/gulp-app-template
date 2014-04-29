var gulp = require('gulp');

gulp.task('build', ['clean', 'browserify', 'stylus', 'copy']);
