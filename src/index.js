const express = require('express');
// 引入数据库配置
require('./db/mongoose');

const app = express();
const port = process.env.PORT || 3000;

// 解析JSON请求体
app.use(express.json());

// 测试路由
app.get('/', (req, res) => {
    res.send('Twitter API is running');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});