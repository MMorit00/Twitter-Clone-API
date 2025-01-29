const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    notificationSenderId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    notificationReceiverId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    notificationType: {
      type: String,
      required: true,
      enum: ["like", "follow"], // 限制通知类型
    },
    postText: {
      type: String,
      trim: true,
      // 不设为必需,因为follow通知不需要此字段
    },
  },
  {
    timestamps: true,
  }
);

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
