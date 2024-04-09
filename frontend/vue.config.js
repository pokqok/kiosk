const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true
})
// vue.config.js
module.exports = {
  devServer: {
    proxy: {
      '/login': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  }
};
