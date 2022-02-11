// const { createProxyMiddleware } = require('http-proxy-middleware');
//
// module.exports = function(app) {
//     app.use(
//         '/api',
//         createProxyMiddleware({
//             target: 'http://localhost:5000',
//             changeOrigin: true,
//         })
//     );
// };
import express from 'express'
import { createProxyMiddleware } from 'http-proxy-middleware'

const app = express()
if ( process.env.NODE_ENV !== 'production' )
    app.use('/api', createProxyMiddleware({ target : 'http://localhost:5000/' }))