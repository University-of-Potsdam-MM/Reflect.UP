var gulp = require('gulp');
var sass = require('gulp-sass');
var cleanCSS = require('gulp-clean-css');
var jsonminify = require('gulp-jsonminify');

gulp.task('styles', function() {
    gulp.src('../www/sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('../www/css/'))
});

//Watch task
gulp.task('default',function() {
    gulp.watch('../www/sass/**/*.scss',['styles']);
});

gulp.task('minify-css', () => {
  return gulp.src('../www/css/*.css')
    .pipe(cleanCSS({debug: true}, function(details) {
      console.log(details.name + ': ' + details.stats.originalSize);
      console.log(details.name + ': ' + details.stats.minifiedSize);
    }))
  .pipe(gulp.dest('../www/css/'));
});

gulp.task('minify-json', function () {
    return gulp.src('../www/js/config.json')
        .pipe(jsonminify())
        .pipe(gulp.dest('../www/js/'));
});

gulp.task('watch', function(){
  gulp.watch('www/sass/*.scss', ['styles'])
})