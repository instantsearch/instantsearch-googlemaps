import baseConfig from './webpack.config.jsdelivr.babel.js';

export default {
  ...baseConfig,
  entry: './dev/app.js',
  devtool: 'source-map',
  output: {
    path: './dev/',
    filename: 'bundle.js'
  },
  devServer: {
    contentBase: 'dev/',
    host: '0.0.0.0',
    compress: true
  },
  externals: {}
};
