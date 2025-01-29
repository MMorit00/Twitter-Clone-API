const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async (req, res, next) => {
  try {
    // 1. 从请求头获取token
    const token = req.header('Authorization').replace('Bearer ', '');
    
    // 2. 验证token
    const decoded = jwt.verify(token, 'twittercourse'); // 使用相同的secret key
    
    // 3. 查找用户
    const user = await User.findOne({
      _id: decoded._id,
      'tokens.token': token
    });

    if (!user) {
      throw new Error();
    }

    // 4. 将token和user添加到request对象中
    req.token = token;
    req.user = user;
    
    next();
  } catch (error) {
    res.status(401).send({ error: 'Please authenticate' });
  }
};

module.exports = auth;