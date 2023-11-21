const Setting = require("../../models/setting.model");

module.exports.general = async (req, res) => {
  const role = res.locals.role;
  if (role.permissions.includes("setting-general_view")) {
    const setting = await Setting.findOne({});
    res.render("./admin/pages/setting/general", {
      pageTitle: "Cài đặt chung",
      setting,
    });
  }
};

module.exports.generalPatch = async (req, res) => {
  if (res.locals.role.permissions.includes("setting-general_edit")) {
    await Setting.updateOne({}, req.body);
    req.flash("success", "Cập nhật cài đặt thành công");
    res.redirect("back");
  }
};
