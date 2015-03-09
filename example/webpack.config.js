module.exports = {
  entry: './example/example.js',

  devtool: 'eval',

  output: {
    path: './example',
    filename: 'bundle.js',
    publicPath: '/example/'
  },

  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel-loader' }
    ]
  }
}
