var gulp = require('gulp');
var watchify = require('watchify');
var browserify = require('browserify');
// var coffeeify = require('coffeeify');
var browserSync = require('browser-sync');
var source = require('vinyl-source-stream');
var jade = require('gulp-jade');
var sass = require('gulp-sass');
var gutil = require('gulp-util');

gulp.task('sass', function() {
  return gulp.src('./src/css/**/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('./dist'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('jade', function() {
  return gulp.src('./src/*.jade')
    .pipe(jade())
    .pipe(gulp.dest('./dist'));
});

gulp.task('watch', ['sass', 'jade'], function() {
  // watchify.args.extensions = watchify.args.extensions || [];
  // watchify.args.extensions.push('.coffee');
  var bundler = watchify(browserify('./src/js/index.js', watchify.args));
  // bundler.transform(coffeeify);
  var rebundle = function () {
    return bundler.bundle()
      .on('error', gutil.log.bind(gutil, 'Browserify Error'))
      .pipe(source('bundle.js'))
      .pipe(gulp.dest('./dist'));
  };

  bundler.on('update', rebundle);
  browserSync({
    open: false,
    server: {
      baseDir: ['.', '.tmp', 'dist']
    },
    port: 3030,
    ghostMode: false,
    notify: false
  });

  gulp.watch(['src/**/*.scss'], ['sass']);
  gulp.watch(['src/**/*.jade'], ['jade']);
  gulp.watch(['src/img/**/*'], browserSync.reload);
  gulp.watch(['dist/*.!(css)'], browserSync.reload);
  return rebundle();
});

gulp.task('default', ['watch']);