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

// 转换JSON时的处理
tweetSchema.methods.toJSON = function () {
  const tweet = this;
  const tweetObject = tweet.toObject();

  // 如果需要处理敏感数据可以在这里处理

  return tweetObject;
};

const Tweet = mongoose.model("Tweet", tweetSchema);

module.exports = Tweet;
