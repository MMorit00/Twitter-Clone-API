const express = require("express");
const Tweet = require("../models/Tweet");
const auth = require("../middleware/auth");
const router = new express.Router();

// 添加auth中间件到需要认证的路由
router.post("/tweets", auth, async (req, res) => {
  try {
    const tweet = new Tweet({
      ...req.body,
      userId: req.user._id, // 现在可以安全地使用req.user
    });
    await tweet.save();
    res.status(201).send(tweet);
  } catch (error) {
    res.status(400).send(error);
  }
});

// 获取所有推文可以保持公开
router.get("/tweets", async (req, res) => {
  try {
    const tweets = await Tweet.find().populate("userId", "name username");
    res.send(tweets);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
