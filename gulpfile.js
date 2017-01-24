const gulp = require('gulp');
const browserSync = require('browser-sync');
const mocha = require('gulp-mocha');
const nodemon = require('gulp-nodemon');
const bower = require('gulp-bower');
const sass = require('gulp-sass');
const eslint = require('gulp-eslint');
const exit = require('gulp-exit'); <<
<< << < HEAD
const karma = require('karma').Server;
const browserify = require('gulp-browserify');
const rename = require('gulp-rename'); ===
=== =
const istanbul = require('gulp-istanbul');


>>>
>>> > fcfcbd9a50b3da7d31cde0220e9f8c237d7e11f3

gulp.task('watch', () => { // Watch tasks
  gulp.watch(['public/css/common.scss',
    'public/css/views/articles.scss'
  ], ['sass']);
  gulp.watch('app/views/**').on('change', browserSync.reload);
  gulp.watch(['public/js/**', 'app/**/*.js'], ['jshint'])
    .on('change', browserSync.reload);
  gulp.watch('public/views/**').on('change', browserSync.reload);
  gulp.watch('public/css/**', ['sass'])
    .on('change', browserSync.reload);
  gulp.watch('app/views/**', ['jade'])
    .on('change', browserSync.reload);
});

gulp.task('jshint', () => gulp.src([
    'gulpfile.js',
    'app/**/*.js',
    'test/**/*.js',
    'public/js/**/*.js'
  ])
  .pipe(jshint()).pipe(jshint.reporter('jshint-stylish')));

gulp.task('lint', () => gulp.src([
    'gulpfile.js',
    'app/**/*.js',
    'test/**/*.js',
    'public/js/**/*.js'
  ])
  .pipe(eslint()));

gulp.task('nodemon', () => {
  nodemon({
    script: 'server.js',
    ext: 'js',
    env: { NODE_ENV: 'development' }
  });
});

gulp.task('server', ['nodemon'], () => {
  browserSync.create({
    proxy: 'localhost:3001',
    server: 'server.js',
    port: 3000,
    reloadOnRestart: true
  });
});

<<
<< << < HEAD
gulp.task('karma', function(done) {
  karma.start({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, function() {
    done();
  });
});

gulp.task('scripts', () => {
  gulp.src('test/**/*.js')
    .pipe(browserify())
    .pipe(rename('bundle.js'))
    .pipe(gulp.dest('build'));
});

gulp.task('sass', () => gulp.src('public/css/common.scss')
  .pipe(sass())
  .pipe(gulp.dest('public/css/')));

gulp.task('bower', () => {
  bower()
    .pipe(gulp.dest('./public/lib'));
});



// Default task(s).
gulp.task('default', ['scripts', 'lint', 'server', 'watch', 'sass']);


// Test task.
gulp.task('test', ['scripts', 'karma']);

// Bower task.
gulp.task('install', ['bower']);
