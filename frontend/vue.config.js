const webpack = require('webpack');

module.exports = {
  transpileDependencies: true,

  devServer: {
    host: "0.0.0.0",
    port: "8080",
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    proxy: {
      "/login": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
      "/api": {
        target: "http://localhost:3000", // 실제 서버 주소
        ws: true, // 웹소켓 프로토콜 사용 여부
        changeOrigin: true, // 필요 시 호스트 헤더를 변경
        pathRewrite: { "^/api": "" }, // API 요청을 /api로 시작하도록 하고 실제 요청 시에는 이 부분을 제거
      },
    },
    https: {
      // key와 cert 파일을 사용하여 https 서버를 실행할 수 있음
      // key: fs.readFileSync('.{디렉토리 경로}/localhost-key.pem'),
      // cert: fs.readFileSync('.{디렉토리 경로}/localhost.pem'),
    },
  },

  configureWebpack: {
    resolve: {
      fallback: {
        "stream": require.resolve("stream-browserify"),
        "os": require.resolve("os-browserify/browser")
      }
    },
    plugins: [
      new webpack.ProvidePlugin({
        process: 'process/browser',
        Buffer: ['buffer', 'Buffer'],
      }),
    ],
  },

  pluginOptions: {
    vuetify: {
      // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vuetify-loader
    },
  },
};
