var gulp = require('gulp');
var concat = require('gulp-concat');

gulp.task('bundle-files', function() {
  return gulp.src([
    './src/vendor/jquery/jquery.3.2.1.min.js',
    './src/vendor/jquery-maskedinput/jquery.maskedinput.1.4.1.js',
    './dist/inline.*.js',
    './dist/polyfills.*.js',
    './dist/vendor.*.js',
    './dist/main.*.js',
    ])
    .pipe(concat('full-bundle.js'))
    .pipe(gulp.dest('./dist/'));
});