
const express = require("express");
const app = express();

// 修正路由文件的引用路径
const userRoutes = require("./routers/user");

// 引入数据库配置
require("./db/mongoose");

const port = process.env.PORT || 3000;
const Tweet = require("./models/Tweet");

// 解析JSON请求体
app.use(express.json());
app.use(userRoutes);

// 测试路由
app.get("/", (req, res) => {
  res.send("Twitter API is running");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});