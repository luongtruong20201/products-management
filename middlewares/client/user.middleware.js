const User = require("../../models/user.model");

module.exports.infoUser = async (req, res, next) => {
  const token = req.cookies.tokenUser;
  if (token) {
    const user = await User.findOne({
      userToken: token,
      deleted: false,
      status: "active",
    }).select("-password -userToken");
    res.locals.user = user;
  }
  next();
};
