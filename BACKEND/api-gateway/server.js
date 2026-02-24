const express = require('express');
// const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
require("module-alias/register");
require('dotenv').config();

const app = express();

/**
 * QUIZ SERVICE
 * Routes: /api/v1/quiz/*
 */
app.use(
    '/api/v1/quiz',
    createProxyMiddleware({
        target: `http://localhost:${process.env.QUIZ_PORT}/api/v1/quiz`,
        changeOrigin: true,
        // pathRewrite: {
        //     '^/api/v1/quiz': '',
        // },
    })
);

app.use(
    '/api/v1/categories',
    createProxyMiddleware({
        target: `http://localhost:${process.env.QUIZ_PORT}/api/v1/categories`,
        changeOrigin: true,
        // pathRewrite: {
        //     '^/api/v1/categories': '',
        // },
    })
);

app.use(
    '/api/v1/users',
    createProxyMiddleware({
        target: `http://localhost:${process.env.USER_PORT}/api/v1/users`,
        changeOrigin: true,
        // pathRewrite: {
        //     '^/api/v1/users': '',
        // },
    })
);
app.use(
    '/api/v1/auth',
    createProxyMiddleware({
        target: `http://localhost:${process.env.AUTH_PORT}/api/v1/auth`,
        changeOrigin: true,
        // pathRewrite: {
        //     '^/api/v1/auth': '',
        // },
    })
);
app.use(
    '/api/v1/notifications',
    createProxyMiddleware({
        target: `http://localhost:${process.env.NOTIFICATIONS_PORT}/api/v1/notifications`,
        changeOrigin: true,
        // pathRewrite: {
        //     '^/api/v1/notifications': '',
        // },
    })
);
app.use(
    '/api/v1/referral',
    createProxyMiddleware({
        target: `http://localhost:${process.env.REFERRAL_PORT}/api/v1/referral`,
        changeOrigin: true,
        // pathRewrite: {
        //     '^/api/v1/referral': '',
        // },
    })
);

app.use(
    '/admin/api/v1/',
    createProxyMiddleware({
        target: `http://localhost:${process.env.ADMIN_PORT}/admin/api/v1/`,
        changeOrigin: true,
        // pathRewrite: {
        //     '^/admin/api/v1/referral': '',
        // },
    })
);

app.use(
    '/api/v1/wallet',
    createProxyMiddleware({
        target: `http://localhost:${process.env.WALLET_PORT}/api/v1/wallet/`,
        changeOrigin: true,
        // pathRewrite: {
        //     '^/admin/api/v1/referral': '',
        // },
    })
);
app.use(
    '/api/v1/leaderboard',
    createProxyMiddleware({
        target: `http://localhost:${process.env.LEADERBOARD_PORT}/api/v1/leaderboard/`,
        changeOrigin: true,
        // pathRewrite: {
        //     '^/admin/api/v1/referral': '',
        // },
    })
);

app.listen(process.env.PORT, () => {
    console.log(`🚀 API Gateway running on port ${process.env.PORT}`);
});
