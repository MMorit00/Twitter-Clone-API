
# Twitter API Clone

这是一个模仿 Twitter 基本功能的 RESTful API 项目，使用 Node.js 和 Express 框架构建。

## 功能特性

- 用户管理
  - 用户注册/登录
  - 个人资料管理(头像、个人简介等)
  - 关注/取消关注其他用户
  
- 推文功能
  - 发布推文
  - 上传图片
  - 点赞/取消点赞
  - 按时间顺序获取推文列表
  
- 通知系统
  - 关注通知
  - 点赞通知
  
- 安全认证
  - JWT token 认证
  - 密码加密存储

## 技术栈

- Node.js
- Express
- MongoDB
- Mongoose
- JWT
- Multer (文件上传)
- Sharp (图片处理)
- ESLint (代码规范)

## 开始使用

### 前置要求

- Node.js (v12+)
- MongoDB (v4+)
- npm 或 yarn

### 安装步骤

1. 克隆项目
```bash
git clone <repository-url>
cd twitter-api
```

2. 安装依赖
```bash
npm install
```

3. 启动 MongoDB
```bash
npm run mongo
```

4. 启动开发服务器
```bash
npm run dev
```

服务器将在 http://localhost:3000 启动

## API 端点

### 用户相关

- POST /users - 创建新用户
- POST /users/login - 用户登录
- GET /users/me - 获取当前用户信息
- PATCH /users/me - 更新用户信息
- POST /users/me/avatar - 上传头像
- GET /users/:id/avatar - 获取用户头像
- PUT /users/:id/follow - 关注用户
- PUT /users/:id/unfollow - 取消关注用户

### 推文相关

- POST /tweets - 发布推文
- GET /tweets - 获取所有推文
- POST /tweets/:id/image - 上传推文图片
- GET /tweets/:id/image - 获取推文图片
- PUT /tweets/:id/like - 点赞推文
- PUT /tweets/:id/unlike - 取消点赞
- GET /tweets/user/:id - 获取指定用户的推文

### 通知相关

- GET /notifications - 获取所有通知
- GET /notifications/:userId - 获取指定用户的通知
- POST /notifications - 创建新通知

## 开发命令

```bash
npm run dev      # 启动开发服务器
npm run start    # 启动生产服务器
npm run lint     # 运行 ESLint 检查
npm run lint:fix # 自动修复 ESLint 问题
```

## 项目结构

```
src/
├── db/          # 数据库配置
├── middleware/  # 中间件
├── models/      # 数据模型
├── routers/     # 路由处理
└── index.js     # 应用入口
```

## 环境变量

项目使用以下环境变量：

- `PORT` - 服务器端口 (默认: 3000)
- `MONGODB_URL` - MongoDB 连接 URL

## 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 许可证

此项目基于 ISC 许可证开源 - 查看 [LICENSE](LICENSE) 文件了解详情
