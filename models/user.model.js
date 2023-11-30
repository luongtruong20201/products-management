const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: String,
    email: String,
    password: String,
    userToken: String,
    phone: String,
    avatar: String,
    status: {
      type: String,
      default: "active",
    },
    requestFriends: Array,
    acceptFriends: Array,
    friendList: [
      {
        user_id: String,
        //  room_chat_id: String
      },
    ],
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date,
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema, "users");

module.exports = User;
