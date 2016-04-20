import webpack from 'webpack';
import autoprefixer from 'autoprefixer';
import csso from 'postcss-csso';

export default {
  entry: './index.js',
  output: {
    path: './dist/',
    filename: 'instantsearch-googlemaps.js',
    library: 'instantsearchGoogleMaps',
    libraryTarget: 'umd'
  },
  module: {
    loaders: [{
      test: /\.js$/, exclude: /node_modules/, loader: 'babel'
    }, {
      test: /\.svg$/, loader: 'raw', exclude: /node_modules/
    }, {
      test: /\.css$/, exclude: /node_modules/,
      loaders: ['style?insertAt=top', 'css', 'postcss']
    }]
  },
  postcss: () => [autoprefixer, csso],
  externals: [{
    react: 'React'
  }, {
    'react-dom': 'ReactDOM'
  }, {
    'instantsearch.js': 'instantsearch'
  }],
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV)
      }
    })
  ]
};
