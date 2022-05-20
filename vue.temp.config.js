module.exports = {
  publicPath: '/',
  // assetsPublicPath: '/pan/',
  devServer: {
    // open: true,
    port: 8081,
    // Paths
    // assetsSubDirectory: 'static',
    // assetsPublicPath: './',
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8080',
        // target: 'http://www.codeman.ink:8001',
        changeOrigin: true,
        ws: true
        // pathRewrite: {
        //   '^/api': ''
        // }
      }
    }
  }
}
