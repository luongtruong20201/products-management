const User = require("../../models/user.model");

module.exports.requireAuth = async (req, res, next) => {
  const token = req.cookies.tokenUser;
  if (!token) {
    res.redirect("/users/login");
    return;
  } else {
    const user = await User.findOne({ userToken: token }).select(
      "-password -token -createdAt -updatedAt"
    );

    res.locals.user = user;
    next();
  }
};
