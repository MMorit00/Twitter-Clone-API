const mongoose = require("mongoose");

const tweetSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
      trim: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    image: {
      type: Buffer,
    },
  },
  {
    timestamps: true, // 添加 createdAt 和 updatedAt 字段
  }
);


// 修改toJSON方法来处理图片属性
tweetSchema.methods.toJSON = function () {
  const tweet = this;
  const tweetObject = tweet.toObject();

  // 检查图片是否存在
  if (tweetObject.image) {
    tweetObject.image = true;  // 如果存在图片,将image属性设置为true
  }

  return tweetObject;
};



const Tweet = mongoose.model("Tweet", tweetSchema);

module.exports = Tweet;
