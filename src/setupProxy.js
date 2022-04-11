const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target: "http://localhost:8081",
            changeOrigin: true,
            pathRewrite: {
               // '^/api': '' // 하위 url 초기화
            }

        })

    );
};