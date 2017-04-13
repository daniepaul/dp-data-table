module.exports = function (config) {
  config.set({
    basePath: '.',

    frameworks: ['jasmine'],
    browsers: ['PhantomJS'],

    files: [
      {pattern: 'node_modules/babel-polyfill/browser.js', instrument: false},
      // shim to workaroud PhantomJS 1.x lack of `bind` support
      // see: https://github.com/ariya/phantomjs/issues/10522
      'node_modules/es5-shim/es5-shim.js',

      // React is an external dependency of the component
      'node_modules/react/dist/react-with-addons.js',

      'spec/spec-helper.js',
      'spec/**/*.spec.*',
      {pattern: 'src/**/*', watched: true, included: false}
    ],

    preprocessors: {
      // add webpack as preprocessor
      'spec/**/*.spec.*': ['webpack', 'sourcemap']
    },

    webpack: loadWebpackConfig(),

    webpackServer: {
      noInfo: true
    },

    singleRun: true
  });
};


/**
 Loads configuration while ensuring sounce-map is enabled
 */
function loadWebpackConfig() {
  var webpackConfig = require('./webpack.config.js');
  webpackConfig.externals = {
    'react': 'var React'
  };
  webpackConfig.devtool = 'inline-source-map';
  return webpackConfig;
}
