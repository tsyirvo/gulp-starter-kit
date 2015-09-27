var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var filter = require('gulp-filter');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync');
var reload = browserSync.reload;

var sassInput = "./src/stylesheets/global.scss";
var sassOutput = "./public/css";
var javascriptsInput = "./src/javascripts/*.js";
var javascriptsOutput = "./public/js";

var sassOptions = {
  errLogToConsole: true,
  outputStyle: 'expanded'
};

gulp.task('sass', function () {
    gulp.src(sassInput)
        .pipe(sourcemaps.init())
        .pipe(sass(sassOptions).on('error', sass.logError))
        .pipe(sass({includePaths: ['scss']}))
        .pipe(sourcemaps.write())
        .pipe(autoprefixer())
        .pipe(gulp.dest(sassOutput))
        .pipe(filter(sassOutput + '/*.css'))
        .pipe(reload({stream:true}))
});

gulp.task('sassdoc', function () {
  return gulp
    .src(sassInput)
    .pipe(sassdoc())
    .resume();
});

gulp.task('browser-sync', function() {
    browserSync.init([sassOutput + '/*.css', javascriptsOutput + '/*.js'], {
        server: {
            baseDir: "./"
        }
    });
});

gulp.task('default', ['sass', 'browser-sync'], function () {
    gulp.watch("src/stylesheets/base/*.scss", ['sass']);
});
