// Karma configuration
// Generated on Tue Jan 10 2017 18:01:50 GMT+0100 (WAT)

module.exports = function(config) {

  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine', 'browserify'],

    // list of files / patterns to load in the browser
    files: [
      'test/src/**/*.js',
      'test/unit/TestSpec.js'
    ],

    // list of files to exclude
    exclude: [],

    plugins: [
      'karma-jasmine',
      'karma-chrome-launcher',
      'karma-coverage',
      'karma-coveralls',
      'karma-jasmine-html-reporter',
      'karma-browserify',
      'karma-ng-html2js-preprocessor'
    ],

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'app/**/*.js': ['coverage'],
      'test/src/**/*.js': ['browserify'],
      'public/views/*.tpl.html': 'ng-html2js'
    },

    browserify: {
      debug: true
    },

    ngHtml2JsPreprocessor: {
      stripPrefix: 'public'
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'coverage', 'coveralls', 'kjhtml'],


    coverageReporter: {
      type: 'lcov',
      dir: 'coverage/'
    },

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    /*  level of logging
     *  possible values: config.LOG_DISABLE || config.LOG_ERROR
     *  || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
     */
    logLevel: config.LOG_INFO,

    /* enable / disable watching file and executing tests
     ** whenever any file changes
     */
    autoWatch: true,

    /* start these browsers
     ** available browser launchers: https://npmjs.org/
     ** browse/keyword/karma-launcher
     */
    browsers: ['Chrome'],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  });
};
