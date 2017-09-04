/* jshint node: true */
var path = require('path');

module.exports = function(env) {

 return {
    context: path.join(__dirname),
    entry: './src/index.js',

    output: {
      path: path.join(__dirname, env.ships === 'dist' ? 'dist' : 'lib'),
      filename: 'dpDataTable.js',
      libraryTarget: 'umd',
      library: 'DpDataTable'
    },

    externals: env.ships === 'dist' ? {
      'react': 'React',
      'react-dom': 'ReactDOM'
    } : {},

    module: {
      loaders: [
        {
          test: /\.scss$/,
          // Query parameters are passed to node-sass
          use: [
            'style-loader',
            { loader: 'css-loader', options: { sourceMap: 1 } },
            { loader: 'sass-loader', options: { sourceMap: 1 } }
          ]
        },
        {
          test: /(\.js)|(\.jsx)$/,
          exclude: /node_modules/,
          loader: 'babel-loader'
        }
      ]
    }
  };
};
