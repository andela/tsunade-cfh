require('dotenv').config();
const gulp = require('gulp'),
  mocha = require('gulp-mocha'),
  nodemon = require('gulp-nodemon'),
  sass = require('gulp-sass'),
  bower = require('gulp-bower'),
  eslint = require('gulp-eslint'),
  browserSync = require('browser-sync'),
  exit = require('gulp-exit');

gulp.task('watch', () => {
  gulp.watch('public/css/common.scss', ['sass']);
  gulp.watch('public/css/**', browserSync.reload);
  gulp.watch('public/views/**', browserSync.reload);
  gulp.watch(['public/js/**', 'app/**/*.js'], browserSync.reload);
  gulp.watch('app/views/**', browserSync.reload);
});
gulp.task('lint', () =>
  gulp.src([
    'gulpfile.js',
    'public/js/**/*.js',
    'test/**/*.js',
    'app/**/*.js'
  ])
  .pipe(eslint({
    rules: {
      quotes: [2, 'single']
    }
  }))
);

gulp.task('bower', () => {
  return bower('./bower_components')
    .pipe(gulp.dest('./public/lib'));
});

gulp.task('mochaTest', () =>
  gulp.src('test/**/*.js', {
    read: false
  })
  .pipe(mocha({
    reporter: 'spec'
  }))
  .pipe(exit())
);

gulp.task('nodemon', () =>
  nodemon({
    script: 'server.js',
    ext: 'js',
    env: {
      NODE_ENV: 'development'
    }
  })
);

gulp.task('server', ['nodemon'], () => {
  browserSync.create({
    proxy: 'localhost:3000',
    ui: {
      port: 3001
    },
    reloadOnRestart: true
  });
});

gulp.task('karma', (done) => {
  karma.start({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, function () {
    done();
  });
});

gulp.task('sass', () => {
  gulp.src('public/css/common.scss')
    .pipe(sass())
    .pipe(gulp.dest('public/css/'));
});

// Default task(s).
gulp.task('default', ['lint', 'server', 'watch', 'sass', 'install']);

// Test task.
gulp.task('test', ['mochaTest']);

// Bower task.
gulp.task('install', ['bower']);
