const User = require("../../models/user.model");

module.exports.requireAuth = async (req, res, next) => {
  const token = req.cookies.tokenUser;
  if (!token) {
    res.redirect("/user/login");
    return;
  } else {
    const user = await User.findOne({ userToken: token }).select(
      "-password -token -createdAt -updatedAt"
    );

    if (user) res.locals.user = user;
    else {
      res.redirect("/user/login");
      return;
    }
    next();
  }
};
