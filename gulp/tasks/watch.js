var gulp = require('gulp');
var browserSync = require('browser-sync');

gulp.task('watch', ['build'], function(){
  gulp.watch('src/js/**', ['browserify']);
  gulp.watch('src/styl/**', ['stylus']);
  gulp.watch('src/images/**', ['images']);
  gulp.watch('src/htdocs/**', ['copy']);

  browserSync.init(['build/**'], {
    server: {
      baseDir: 'build'
    }
  });
});
