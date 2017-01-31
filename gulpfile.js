const gulp = require('gulp');
const browserSync = require('browser-sync');
const eslint = require('gulp-eslint');
const mocha = require('gulp-mocha');
const nodemon = require('gulp-nodemon');
const sass = require('gulp-sass');
const bower = require('gulp-bower');
const jade = require('gulp-jade');
const exit = require('gulp-exit');

// Default task(s).
gulp.task('default', ['jshint', 'server', 'watch', 'sass']);

// jshint task
gulp.task('eslint', () => gulp.src([
  'gulpfile.js',
  'app/**/*.js',
  'test/**/*.js',
  'public/js/**/*.js'
]).pipe(eslint()));

gulp.task('mochaTest', () => {
  gulp.src('test/**/*.js', { read: false })
        .pipe(mocha({ reporter: 'spec' }))
        .pipe(exit());
});

// Nodemon task
gulp.task('nodemon', () => {
  nodemon({
    script: 'server.js',
    ext: 'js'
  });
});

// Sass Task
gulp.task('sass', () => gulp.src('public/css/common.scss')
        .pipe(sass())
        .pipe(gulp.dest('public/css/')));

// Jade Task
gulp.task('jade', () => gulp.src('app/views/**/*.jade')
        .pipe(jade())
        .pipe(gulp.dest('public/views/')));

// Bower Task
gulp.task('bower', () => {
  bower()
        .pipe(gulp.dest('./public/lib/'));
});

// Watch Task
gulp.task('watch', () => {
  gulp.watch('public/css/*.scss', ['sass']);
  gulp.watch('app/**/*.js', ['jshint']);
  gulp.watch(['public/**/**', 'app/views/**/*.jade'])
        .on('change', browserSync.reload);
});

// Server Task
gulp.task('server', ['nodemon'], () => {
  browserSync.create({
    server: 'server.js',
    port: 3000,
    reloadOnRestart: true
  });
});

// Test task.
gulp.task('test', ['mochaTest']);

// Default task(s).
gulp.task('default', ['eslint', 'server', 'watch']);
