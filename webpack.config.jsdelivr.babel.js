import webpack from 'webpack';

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
    }]
  },
  externals: [{
    react: 'React'
  }, {
    'react-dom': 'ReactDOM'
  }],
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV)
      }
    })
  ]
};
