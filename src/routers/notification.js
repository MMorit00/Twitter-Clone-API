const express = require("express");
const auth = require("../middleware/auth");
const Notification = require("../models/notification");
const mongoose = require("mongoose");
const router = new express.Router();

// 创建新通知
router.post("/notifications", auth, async (req, res) => {
  try {
    const notification = new Notification({
      username: req.body.username,
      notificationSenderId: req.user._id,  // 发送者 ID
      notificationReceiverId: new mongoose.Types.ObjectId(req.body.notificationReceiverId),  // 接收者 ID
      notificationType: req.body.notificationType,
      postText: req.body.postText,
    });

    // 保存通知并返回完整的通知对象
    await notification.save();
    res.status(201).send(notification);  // 返回通知对象，而不是空对象
  } catch (error) {
    console.log(error);
    res.status(400).send(error); // 返回错误消息
  }
});

// 获取所有通知
router.get("/notifications", async (req, res) => {
  try {
    const notifications = await Notification.find()
      .populate("notificationSenderId", "username")
      .sort({ createdAt: -1 });
    res.send(notifications);
  } catch (error) {
    res.status(500).send(error);
  }
});

// 获取特定用户的通知
router.get("/notifications/:userId", async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.params.userId);  // 确保 userId 是 ObjectId 类型
    console.log("Fetching notifications for userId: ", userId);  // 打印 userId 用于调试
    const notifications = await Notification.find({
      notificationReceiverId: userId,
    })
      .populate("notificationSenderId", "username")
      .sort({ createdAt: -1 });

    res.send(notifications);
  } catch (error) {
    console.error(error);  // 打印错误
    res.status(500).send(error);
  }
});

module.exports = router;