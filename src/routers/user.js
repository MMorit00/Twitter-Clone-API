const express = require("express");
const User = require("../models/user");
const multer = require("multer");
const sharp = require("sharp");
const auth = require("../middleware/auth");
const router = express.Router();

// 配置multer
const upload = multer({
  limits: {
    fileSize: 1000000, // 限制文件大小为1MB
  },
});

router.post("/users", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).send(user);
  } catch (error) {
    res.status(404).send(error);
  }
});

router.get("/users", async (req, res) => {
  try {
    const users = await User.find(); // 获取所有用户
    res.json(users);
  } catch (err) {
    res.status(500).json(err); // 错误处理
  }
});

// 用户登录路由
router.post("/users/login", async (req, res) => {
  try {
    // 验证用户
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );

    // 生成token
    const token = await user.generateAuthToken();

    // 返回用户信息和token
    res.send({ user, token });
  } catch (error) {
    res.status(400).send({
      error: error.message,
    });
  }
});

// 删除用户路由
router.delete("/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).send();
    }

    res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

// 获取特定用户路由
router.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).send();
    }

    res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

// 添加头像上传路由
router.post(
  "/users/me/avatar",
  auth,
  upload.single("avatar"),
  async (req, res) => {
    try {
      // 使用sharp处理图片
      const buffer = await sharp(req.file.buffer)
        .resize(250, 250)
        .png()
        .toBuffer();

      // 清除旧头像
      if (req.user.avatarExists) {
        req.user.avatar = null;
      }

      // 保存新头像
      req.user.avatar = buffer;
      req.user.avatarExists = true;
      await req.user.save();

      res.send({ message: "Profile image uploaded successfully" });
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  }
);

// 添加登出路由
router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.send({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).send();
  }
});

// 获取用户头像路由
router.get("/users/:id/avatar", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user || !user.avatarExists) {
      throw new Error("User or avatar not found");
    }

    res.set("Content-Type", "image/jpeg");
    res.send(user.avatar);
  } catch (error) {
    res.status(404).send({ error: error.message });
  }
});

// 关注用户路由
router.patch("/users/:id/follow", auth, async (req, res) => {
  // 1. 检查是否试图关注自己
  if (req.user.id === req.params.id) {
    return res.status(403).json({ message: "你不能关注自己" });
  }

  try {
    // 2. 查找要关注的用户
    const userToFollow = await User.findById(req.params.id);
    if (!userToFollow) {
      return res.status(404).json({ message: "用户不存在" });
    }

    // 3. 检查是否已经关注
    if (userToFollow.followers.includes(req.user.id)) {
      return res.status(403).json({ message: "你已经关注了这个用户" });
    }

    // 4. 更新关注关系
    // 将当前用户ID添加到目标用户的followers数组
    await User.findByIdAndUpdate(req.params.id, {
      $push: { followers: req.user.id },
    });

    // 将目标用户ID添加到当前用户的following数组
    await User.findByIdAndUpdate(req.user.id, {
      $push: { following: req.params.id },
    });

    // 5. 返回成功响应
    res.status(200).json({ message: "关注成功" });
  } catch (error) {
    // 6. 错误处理
    res.status(500).json({ message: "服务器错误" });
  }
});

// 取消关注用户路由
router.patch("/users/:id/unfollow", auth, async (req, res) => {
  // 1. 检查是否试图取消关注自己
  if (req.user.id === req.params.id) {
    return res.status(403).json({ message: "你不能取消关注自己" });
  }

  try {
    // 2. 查找要取消关注的用户
    const userToUnfollow = await User.findById(req.params.id);
    if (!userToUnfollow) {
      return res.status(404).json({ message: "用户不存在" });
    }

    // 3. 检查是否已经关注了该用户
    if (!userToUnfollow.followers.includes(req.user.id)) {
      return res.status(403).json({ message: "你还没有关注这个用户" });
    }

    // 4. 更新关注关系
    // 从目标用户的 followers 数组中移除当前用户 ID
    await User.findByIdAndUpdate(req.params.id, {
      $pull: { followers: req.user.id },
    });

    // 从当前用户的 following 数组中移除目标用户 ID
    await User.findByIdAndUpdate(req.user.id, {
      $pull: { following: req.params.id },
    });

    // 5. 返回成功响应
    res.status(200).json({ message: "已取消关注" });
  } catch (error) {
    // 6. 错误处理
    res.status(500).json({ message: "服务器错误" });
  }
});



// 更新用户资料路由
router.patch('/users/me', auth, async (req, res) => {
  try {
    // 1. 定义允许更新的字段
    const allowedUpdates = [
      'name',
      'email',
      'password',
      'website',
      'bio',
      'location'
    ];

    // 2. 获取用户请求要更新的字段
    const updates = Object.keys(req.body);

    // 3. 验证更新字段是否合法
    const isValidOperation = updates.every((update) => 
      allowedUpdates.includes(update)
    );

    // 4. 如果包含非法字段,返回错误
    if (!isValidOperation) {
      return res.status(400).send({ error: 'Invalid request' });
    }

    // 5. 遍历更新字段并应用更新
    updates.forEach((update) => {
      req.user[update] = req.body[update];
    });

    // 6. 保存更新后的用户
    await req.user.save();

    // 7. 返回更新后的用户
    res.send(req.user);

  } catch (error) {
    res.status(400).send(error);
  }
});


module.exports = router;
