const mongoose = require("mongoose");

// MongoDB连接URL
// mongodb://127.0.0.1:27017/twitter-api 解析：
// - mongodb:// 协议
// - 127.0.0.1 本地主机IP
// - 27017 MongoDB默认端口
// - twitter-api 数据库名称
mongoose
  .connect("mongodb://127.0.0.1:27018/twitter-api", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // serverSelectionTimeoutMS: 5000,
    // socketTimeoutMS: 45000,
    // family: 4,
  })
  .then(() => {
    console.log("Successfully connected to MongoDB.");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
    throw new Error("Failed to connect to MongoDB");
  });
