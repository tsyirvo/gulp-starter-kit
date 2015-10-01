var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var filter = require('gulp-filter');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var newer = require('gulp-newer');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var uncss = require('gulp-uncss');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');

var sassInput = "./src/stylesheets/global.scss";
var sassOutput = "./public/css";
var javascriptsInput = "./src/javascripts/*.js";
var javascriptsOutput = "./public/js";
var imgInput = "./src/images/*";
var imgOutput = "./public/images";

var sassOptions = {
  errLogToConsole: true,
  outputStyle: 'expanded'
};

gulp.task('sass', function() {
  gulp.src(sassInput)
    .pipe(newer(sassOutput))
    .pipe(sourcemaps.init())
    .pipe(sass(sassOptions).on('error', sass.logError))
    .pipe(sass({
      includePaths: ['scss'],
      outputStyle: 'compressed'
    }))
    .pipe(sourcemaps.write())
    .pipe(autoprefixer())
    .pipe(gulp.dest(sassOutput))
    .pipe(filter(sassOutput + '/*.css'))
    .pipe(reload({
      stream: true
    }))
});

gulp.task('uncss', function() {
  return gulp.src([
      'node_modules/bootstrap/dist/css/bootstrap.css',
      'node_modules/bootstrap/dist/css/bootstrap-theme.css'
    ])
    .pipe(uncss({
      html: [
        'http://localhost:3000/',
      ]
    }))
    .pipe(gulp.dest('./public/css/bootstrap'));
});

gulp.task('js', function() {
  return gulp.src(javascriptsInput)
    .pipe(newer(javascriptsOutput))
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(uglify())
    .pipe(concat('app.js'))
    .pipe(gulp.dest(javascriptsOutput));
});

gulp.task('images', function() {
  return gulp.src(imgInput)
    .pipe(newer(imgOutput))
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{
        removeViewBox: false
      }],
      use: [pngquant()]
    }))
    .pipe(gulp.dest(imgOutput));
});

gulp.task('browser-sync', function() {
  browserSync.init([sassOutput + '/*.css', javascriptsOutput + '/*.js', 'index.html'], {
    server: {
      baseDir: "./"
    }
  });
});

gulp.task('default', ['sass', 'uncss', 'js', 'images', 'browser-sync'], function() {
  gulp.watch("src/stylesheets/base/*.scss", ['sass']);
  gulp.watch(javascriptsInput, ['js']);
  gulp.watch(imgInput, ['images']);
});
