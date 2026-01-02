const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = 33333;
app.use(cors());
const proxyOptions = {
    target: 'https://v8.qqslyx.com',
    changeOrigin: true,
    secure: true,
    pathRewrite: {
        '^/api': ''
    },
    onProxyRes: (proxyRes, req, res) => {
        if (proxyRes.headers['set-cookie']) {
            proxyRes.headers['set-cookie'] = proxyRes.headers['set-cookie'].map(cookie => {
                return cookie
                    .replace(/Domain=[^;]+;?/i, '')
                    .replace(/Secure;?/i, '');
            });
        }
        if (req.path.includes('stream.php')) {
            delete proxyRes.headers['content-encoding'];
        }
    }
};
const apiProxy = createProxyMiddleware(proxyOptions);
app.use('/api', apiProxy);
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});
app.listen(PORT, () => {
    console.log(`========================================`);
    console.log(`🚀 FREEGLM 后端服务已启动！`);
    console.log(`📡 本地访问地址: http://localhost:${PORT}`);
    console.log(`📡 开发：wangshengithub`);
    console.log(`========================================`);
});