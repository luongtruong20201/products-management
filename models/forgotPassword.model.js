const mongoose = require("mongoose");

const forgotPasswordSchema = mongoose.Schema(
  {
    email: String,
    otp: String,
    expireAt: { type: Date, default: Date.now, expires: 3000 },
  },
  { timestamps: true }
);

const ForgotPassword = mongoose.model(
  "ForgotPassword",
  forgotPasswordSchema,
  "forgot-password"
);

module.exports = ForgotPassword;
