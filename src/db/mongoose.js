const mongoose = require("mongoose");

// MongoDB连接URL
// mongodb://127.0.0.1:27017/twitter-api 解析：
// - mongodb:// 协议
// - 127.0.0.1 本地主机IP
// - 27017 MongoDB默认端口
// - twitter-api 数据库名称
mongoose
  .connect("mongodb://127.0.0.1:27017/twitter-api", {
    // 使用新的URL解析器
    useNewUrlParser: true,
    // 使用统一的拓扑结构
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Successfully connected to MongoDB.");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
