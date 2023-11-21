const mongoose = require("mongoose");

const settingSchema = new mongoose.Schema(
  {
    websiteName: String,
    logo: String,
    address: String,
    phone: String,
    email: String,
    copyright: String,
  },
  { timestamps: true }
);

const Setting = mongoose.model("Setting", settingSchema);
module.exports = Setting;
