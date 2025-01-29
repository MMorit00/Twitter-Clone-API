const express = require("express");
const Tweet = require("../models/Tweet");
const auth = require("../middleware/auth");
const multer = require("multer");
const sharp = require("sharp");
const router = new express.Router();

// 配置 multer
const upload = multer({
  limits: {
    fileSize: 1000000, // 限制文件大小为1MB
  },
});

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
    const tweets = await Tweet.find()
      .populate("userId", "name username")
      .sort({ createdAt: -1 }); // 按时间倒序排列
    res.send(tweets);
  } catch (error) {
    res.status(500).send(error);
  }
});

// 上传推文图片路由
router.post(
  "/tweets/:id/image",
  auth,
  upload.single("image"),
  async (req, res) => {
    try {
      const tweet = await Tweet.findOne({
        _id: req.params.id,
        userId: req.user._id,
      });

      if (!tweet) {
        throw new Error("Tweet not found or unauthorized");
      }

      // 使用 sharp 处理图片
      const buffer = await sharp(req.file.buffer)
        .resize(1080) // 调整宽度,保持宽高比
        .png()
        .toBuffer();

      tweet.image = buffer;
      await tweet.save();
      res.send({ message: "Tweet image uploaded successfully" });
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  }
);

// 获取推文图片路由
router.get("/tweets/:id/image", async (req, res) => {
  try {
    const tweet = await Tweet.findById(req.params.id);

    if (!tweet || !tweet.image) {
      throw new Error("Tweet or image not found");
    }

    res.set("Content-Type", "image/png");
    res.send(tweet.image);
  } catch (error) {
    res.status(404).send({ error: error.message });
  }
});

module.exports = router;
