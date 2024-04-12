const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,

  devServer: {
    proxy: {
      '/login': {
        target: 'http://localhost:3000',
        changeOrigin: true
      },
      '/api': {
        target: 'http://localhost:3000', // 실제 서버 주소
        ws: true, // 웹소켓 프로토콜 사용 여부
        changeOrigin: true, // 필요 시 호스트 헤더를 변경
        pathRewrite: { '^/api': '' }, // API 요청을 /api로 시작하도록 하고 실제 요청 시에는 이 부분을 제거
      },
      '/tags': {
        target: 'http://localhost:3000',
        changeOrigin: true
      },
    }
  },

  pluginOptions: {
    vuetify: {
			// https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vuetify-loader
		}
  }
});
