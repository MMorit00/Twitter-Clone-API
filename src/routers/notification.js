const express = require("express");
const auth = require("../middleware/auth");
const Notification = require("../models/notification");
const router = new express.Router();

// 创建新通知
router.post("/notifications", auth, async (req, res) => {
  try {
    const notification = new Notification({
      username: req.body.username,
      notificationSenderId: req.user._id,
      notificationReceiverId: req.body.notificationReceiverId,
      notificationType: req.body.notificationType,
      postText: req.body.postText,
    });

    await notification.save();
    res.status(201).send(notification);
  } catch (error) {
    res.status(400).send(error);
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
    const notifications = await Notification.find({
      notificationReceiverId: req.params.userId,
    })
      .populate("notificationSenderId", "username")
      .sort({ createdAt: -1 });

    res.send(notifications);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
