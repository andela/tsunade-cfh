const gulp = require('gulp');
const browserSync = require('browser-sync');
const mocha = require('gulp-mocha');
const eslint = require('gulp-eslint');
const nodemon = require('gulp-nodemon');
const bower = require('gulp-bower');
const sass = require('gulp-sass');
const exit = require('gulp-exit');


require('dotenv').config();
   // Configuration

gulp.task('watch', () => {
  gulp.watch(['public/css/common.scss',
    'public/css/views/articles.scss'], ['sass']);

  gulp.watch(['public/js/**', 'app/**/*.js'], ['lint'])
    .on('change', browserSync.reload);

  gulp.watch('public/views/**').on('change', browserSync.reload);

  gulp.watch('public/css/**', ['sass'])
    .on('change', browserSync.reload);

  gulp.watch('app/views/**', ['jade'])
    .on('change', browserSync.reload);
});

 // setup eslint
gulp.task('lint', () => gulp.src([
  'gulpfile.js',
  'app/**/*.js',
  'test/**/*.js',
  'public/js/**/*.js'])
        .pipe(eslint()));

// setup nodemon
gulp.task('nodemon', () => {
  nodemon({
    script: 'server.js',
    ext: 'js',
    env: { NODE_ENV: 'development' }
  });
});

// setup server
gulp.task('server', ['nodemon'], () => {
  browserSync.create({
    proxy: 'localhost:3001',
    server: 'server.js',
    port: 3000,
    reloadOnRestart: true
  });
});

// setup mocha
gulp.task('mochaTest', () => {
  gulp.src('test/**/*.js', { read: false })
    // gulp-mocha needs filepaths so you can't have any plugins before it
    .pipe(mocha({ reporter: 'spec' }))
    .pipe(exit());
});

// setup sass
gulp.task('sass', () => gulp.src('public/css/common.scss')
    .pipe(sass())
    .pipe(gulp.dest('public/css/')));

// setup bower
gulp.task('bower', () => {
  bower()
    .pipe(gulp.dest('./public/lib/'));
});

// install bower
gulp.task('install', () => bower('./bower_components')
    .pipe(gulp.dest('./public/lib')));

// Default task(s).
gulp.task('default', ['lint', 'server', 'watch', 'sass'], (done) => {
  done();
});

// Test task.
gulp.task('test', ['mochaTest'], (done) => {
  done();
});

// Bower task.
gulp.task('install', ['bower'], (done) => {
  done();
});
