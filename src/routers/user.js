const express = require('express');
const User = require('../models/user');

const router = express.Router();


router.post('/users', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).send(user);
    } catch (error) {
        res.status(404).send(error);
    }
});


router.get('/users', async (req, res) => {
    try {
      const users = await User.find() // 获取所有用户
      res.json(users)
    } catch (err) {
      res.status(500).json(err) // 错误处理
    }
  })


  
module.exports = router;