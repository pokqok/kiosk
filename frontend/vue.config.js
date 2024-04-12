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
    ,
    https: {
      // key와 cert 파일을 사용하여 https 서버를 실행할 수 있음
      // key: fs.readFileSync('.{디렉토리 경로}/localhost-key.pem'),
      // cert: fs.readFileSync('.{디렉토리 경로}/localhost.pem'),
    },
  }
};
