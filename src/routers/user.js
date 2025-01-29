const express = require("express");
const User = require("../models/user");

const router = express.Router();

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


module.exports = router;
