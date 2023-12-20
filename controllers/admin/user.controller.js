const User = require("../../models/user.model");

module.exports.index = async (req, res) => {
  const users = await User.find({ deleted: false }).select(
    "-password -userToken -deletedAt -createdAt"
  );

  res.render("./admin/pages/users/index", {
    pageTitle: "Quản lý tài khoản khách",
    users,
  });
};

module.exports.changeStatus = async (req, res) => {
  const { status, id } = req.params;
  try {
    await User.updateOne({ _id: id }, { status: status });
    req.flash("success", "Thay đổi trạng thái thành công");
  } catch (error) {
    console.log(error);
    req.flash("error", "Thay đổi trạng thái thât bại");
  } finally {
    res.redirect("back");
  }
};

module.exports.detail = async (req, res) => {
  const { id } = req.params;
  try {
    const guest = await User.findById(id);
    console.log(guest);
    return res.render("./admin/pages/users/detail", { guest });
  } catch (err) {
    console.log(err);
    res.redirect("back");
  }
};

module.exports.delete = async (req, res) => {
  const { id } = req.params;
  try {
    await User.updateOne({ _id: id }, { deleted: true, deletedAt: Date.now() });
    res.redirect("back");
  } catch (error) {
    console.log(error);
    res.redirect("back");
  }
};
