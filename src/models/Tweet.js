const express = require("express");
const Tweet = require("../models/Tweet");
const router = new express.Router();

// 创建新推文
router.post("/tweets", async (req, res) => {
  try {
    const tweet = new Tweet({
      ...req.body,
      userId: req.user._id, // 这里假设我们已经有了认证中间件设置 req.user
    });
    await tweet.save();
    res.status(201).send(tweet);
  } catch (error) {
    res.status(400).send(error);
  }
});

// 获取所有推文
router.get("/tweets", async (req, res) => {
  try {
    const tweets = await Tweet.find().populate("userId", "name username");
    res.send(tweets);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
