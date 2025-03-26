module.exports = {
  publicPath: '/',
  devServer: {
    port: 3333,
    historyApiFallback: true,
    hot: true,
    open: true
  },
  configureWebpack: {
    output: {
      filename: '[name].[contenthash].js',
      chunkFilename: '[name].[contenthash].js'
    }
  }
}