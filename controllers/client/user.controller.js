const md5 = require("md5");
const User = require("../../models/user.model");
const ForgotPassword = require("../../models/forgotPassword.model");
const Cart = require("../../models/cart.model");
const {
  generateRandomString,
  generateRandomOTP,
} = require("../../helpers/generate");
const { sendMail } = require("../../helpers/sendmail");
module.exports.register = (req, res) => {
  res.render("./client/pages/user/register", {
    pageTitle: "Đăng ký tài khoản",
  });
};

module.exports.registerPost = async (req, res) => {
  const email = req.body.email;

  const isExisted = await User.findOne({ email });
  if (isExisted) {
    req.flash("error", "Email đã tồn tại");
    res.redirect("back");
  } else {
    req.body.password = md5(req.body.password);
    const user = new User(req.body);
    await user.save();

    req.flash("success", "Đăng ký tài khoản thành công");
    res.redirect("/user/login");
  }
};

module.exports.login = (req, res) => {
  res.render("./client/pages/user/login", { pageTitle: "Đăng nhập" });
};

module.exports.loginPost = async (req, res) => {
  const user = await User.findOne({ email: req.body.email, deleted: false });
  if (!user) {
    req.flash("error", "Email không tồn tại, vui lòng đăng ký tài khoản");
    res.redirect("back");
  } else {
    if (user.status === "inactive") {
      req.flash("error", "Tài khoản dã bị khóa");
      res.redirect("back");
      return;
    }
    if (user.password === md5(req.body.password)) {
      const token = generateRandomString(50);
      await User.updateOne({ email: req.body.email }, { userToken: token });
      const cart = new Cart({ user_id: user.id });
      await cart.save();
      await User.updateOne({ _id: user.id }, { onlineStatus: "online" });

      _io.once("connection", (socket) => {
        socket.broadcast.emit("SERVER_RETURN_USER_ONLINE", {
          userId: user.id,
          status: "online",
        });
      });

      res.cookie("tokenUser", token);
      res.redirect("/");
      return;
    } else {
      req.flash("error", "Tài khoản hoặc mật khẩu không chính xác");
      res.redirect("back");
      return;
    }
  }
};

module.exports.logout = async (req, res) => {
  try {
    const tokenUser = req.cookies.tokenUser;
    await User.updateOne(
      { userToken: tokenUser },
      { $set: { userToken: "", onlineStatus: "offline" } }
    );

    _io.once("connection", (socket) => {
      socket.broadcast.emit("SERVER_RETURN_USER_ONLINE", {
        userId: res.locals.user.id,
        status: "offline",
      });
    });

    res.clearCookie("tokenUser");
    res.clearCookie("cartId");
    req.flash("success", "Đăng xuất thành công");
  } catch (error) {
    console.log(error);
    req.flash("error", "Vui lòng thử lại sau");
  } finally {
    res.redirect("/");
  }
};

module.exports.forgotPassword = (req, res) => {
  res.render("./client/pages/user/forgot-password", {
    pageTitle: "Quên mật khẩu",
  });
};

module.exports.forgotPasswordPost = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email, deleted: false });
    if (!user) {
      req.flash("error", "Email không tồn tại");
      res.redirect("back");
    } else {
      const otp = generateRandomOTP(6);
      const objectForgotPassword = {
        email: email,
        otp: otp,
      };
      sendMail(otp, email);
      const forgotPassword = new ForgotPassword(objectForgotPassword);
      await forgotPassword.save();

      req.flash("success", "Vui lòng kiểm tra email");
      res.redirect(`/user/password/otp?email=${email}`);
    }
  } catch (error) {
    console.log(error);
    req.flash("error", "Vui lòng thử lại sau");
    res.redirect("back");
  }
};

module.exports.otpPassword = (req, res) => {
  const { email } = req.query;
  res.render("./client/pages/user/otp-password", {
    pageTitle: "Nhập mã OTP",
    email,
  });
};

module.exports.otpPasswordPost = async (req, res) => {
  const { otp, email } = req.body;
  try {
    const record = await ForgotPassword.findOne({ otp, email });
    if (record !== null) {
      res.redirect(`/user/password/reset?email=${email}`);
    } else {
      req.flash("error", "Vui lòng thử lại sau");
      res.redirect("back");
    }
  } catch (error) {
    res.redirect("back");
  }
};

module.exports.resetPassword = (req, res) => {
  const { email } = req.query;
  res.render("./client/pages/user/reset", {
    pageTitle: "Đặt lại mật khẩu",
    email,
  });
};

module.exports.resetPasswordPost = async (req, res) => {
  const { email } = req.query;
  const { password, confirmPassword } = req.body;
  if (password !== confirmPassword) {
    req.flash("Nhập lại mật khẩu phải chính xác");
    res.redirect("back");
    return;
  }
  try {
    const token = generateRandomString(50);
    await User.updateOne(
      { email },
      { $set: { userToken: token, password: md5(password) } }
    );
    await ForgotPassword.deleteOne({ email });
    res.cookie("tokenUser", token, { httpOnly: true });
    req.flash("sucecss", "Thay đổi mật khẩu thành công");
    res.redirect("/");
  } catch (error) {
    req.flash("error", "Đã có lỗi xảy ra, vui lòng thử lại sau");
    res.redirect("back");
  }
};

module.exports.info = async (req, res) => {
  const user = res.locals.user;
  res.render("./client/pages/user/info", {
    user,
    pageTitle: "Thông tin tài khoản",
  });
};

module.exports.edit = async (req, res) => {
  const user = res.locals.user;
  res.render("./client/pages/user/edit", {
    user,
    pageTitle: "Chỉnh sửa thông tin",
  });
};

module.exports.editPatch = async (req, res) => {
  await User.updateOne({ userToken: req.cookies.tokenUser }, req.body);
  req.flash("success", "Cập nhật tài khoản thành công");
  res.redirect("back");
};
