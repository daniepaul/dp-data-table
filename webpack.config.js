/* jshint node: true */
var path = require('path');

module.exports = function(env) {

 return {
    context: path.join(__dirname),
    entry: './src/index.js',
    mode: env.dist ? 'production' : 'development',
    output: {
      path: path.join(__dirname, env.dist ? 'dist' : 'lib'),
      filename: 'dpDataTable.js',
      libraryTarget: 'umd',
      library: 'DpDataTable'
    },

    externals: env.dist ? {
      'react': 'React',
      'react-dom': 'ReactDOM'
    } : {},

    module: {
      rules: [
        {
          test: /\.scss$/,
          // Query parameters are passed to node-sass
          use: [
            // Creates `style` nodes from JS strings
            "style-loader",
            // Translates CSS into CommonJS
            "css-loader",
            // Compiles Sass to CSS
            "sass-loader",
          ],
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
