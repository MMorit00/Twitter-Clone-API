const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('邮箱格式不正确')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('密码不能包含 "password" 字符串')
            }
        }
    },
    avatar: {
        type: Buffer
    },
    avatarExists: {
        type: Boolean,
        default: false
    },
    bio: {
        type: String,
        trim: true
    },
    website: {
        type: String,
        trim: true
    },
    location: {
        type: String,
        trim: true
    },
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
}, {
    timestamps: true // 添加 createdAt 和 updatedAt 字段
})


// 添加虚拟字段建立与 tweets 的关联
userSchema.virtual("tweets", {
    ref: "Tweet", // 关联的 Model
    localField: "_id", // User model 中的关联字段
    foreignField: "userId", // Tweet model 中的关联字段
  });

  
  


userSchema.methods.toJSON = function() {
    const user = this;
    const userObject = user.toObject();
    
    // delete userObject.password;
    
    return userObject;
}


// 密码哈希处理：在保存用户前自动哈希密码
userSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) { // 仅当密码被修改时才哈希
      user.password = await bcrypt.hash(user.password, 8); // 盐轮数设为8
    }
    next(); // 必须调用next()以继续保存流程
  });


  

const User = mongoose.model('User', userSchema)

module.exports = User 