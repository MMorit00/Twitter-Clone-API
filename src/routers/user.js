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
  
      // 使用sharp处理图片
      const buffer = await sharp(req.file.buffer)
        .resize(250, 250)
        .png()
        .toBuffer();

      // 测试阶段直接返回处理后的buffer
      res.send(buffer);

    
    // 清除旧头像
    if (req.user.avatarExists) {
      req.user.avatar = null;
    }
    
    // 保存新头像
    req.user.avatar = buffer;
    req.user.avatarExists = true;
    await req.user.save();
  
    res.send({ message: 'Profile image uploaded successfully' });
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);


// 添加登出路由
router.post('/users/logout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.send({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).send();
  }
});


module.exports = router;
