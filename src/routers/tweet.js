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

router.post("/tweets", auth, async (req, res) => {
  try {
    const tweet = new Tweet({
      ...req.body,
      userId: req.user._id,
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

router.put("/tweets/:id/like", auth, async (req, res) => {
  try {
    // 先查找推文，确保存在
    const tweet = await Tweet.findById(req.params.id);
    if (!tweet) {
      return res.status(404).send({ error: "Tweet not found" });
    }

    // 检查是否已经点赞
    if (!tweet.likes.includes(req.user._id)) {
      // 使用 findByIdAndUpdate 返回更新后的 tweet 对象，并填充用户信息
      const updatedTweet = await Tweet.findByIdAndUpdate(
        req.params.id,
        { $push: { likes: req.user._id } },
        { new: true }
      ).populate("userId", "name username");
      return res.status(200).send(updatedTweet);
    } else {
      return res.status(403).send({ error: "You have already liked this tweet" });
    }
  } catch (error) {
    res.status(500).send(error);
  }
});
// ... existing code ...

router.put("/tweets/:id/unlike", auth, async (req, res) => {
  try {
    const tweet = await Tweet.findById(req.params.id);
    if (!tweet) {
      return res.status(404).send({ error: "Tweet not found" });
    }
    if (tweet.likes.includes(req.user._id)) {
      // 使用 findByIdAndUpdate 返回更新后的 tweet 对象
      const updatedTweet = await Tweet.findByIdAndUpdate(
        req.params.id,
        { $pull: { likes: req.user._id } },
        { new: true }
      ).populate("userId", "name username");
      return res.status(200).send(updatedTweet);
    } else {
      return res.status(403).send({ error: "You have already unliked this tweet" });
    }
  } catch (error) {
    res.status(500).send(error);
  }
});
// 获取特定用户的推文
router.get("/tweets/user/:id", async (req, res) => {
  try {
    const tweets = await Tweet.find({
      userId: req.params.id,
    })
      .populate("userId", "name username")
      .sort({ createdAt: -1 });

    if (!tweets || tweets.length === 0) {
      return res.status(404).send([]);
    }

    res.send(tweets);
  } catch (error) {
    res.status(500).send(error);
  }
});


module.exports = router;
