const ProductCategory = require("../../models/product-category.model");
const Product = require("../../models/product.model");
const User = require("../../models/user.model");
const Account = require("../../models/account.model");

// [GET] /admin/dashboard
module.exports.dashboard = async (req, res) => {
  const statistic = {
    productCategory: {
      total: 0,
      active: 0,
      inactive: 0,
    },
    products: {
      total: 0,
      active: 0,
      inactive: 0,
    },
    accounts: {
      total: 0,
      active: 0,
      inactive: 0,
    },
    users: {
      total: 0,
      active: 0,
      inactive: 0,
    },
  };

  [
    statistic.productCategory.total,
    statistic.productCategory.active,
    statistic.productCategory.inactive,
    statistic.products.total,
    statistic.products.active,
    statistic.products.inactive,
    statistic.users.total,
    statistic.users.active,
    statistic.users.inactive,
    statistic.accounts.inactive,
    statistic.accounts.inactive,
    statistic.accounts.inactive,
  ] = await Promise.all([
    ProductCategory.countDocuments({
      deleted: false,
    }),
    (statistic.productCategory.active = await ProductCategory.countDocuments({
      deleted: false,
      status: "active",
    })),
    (statistic.productCategory.inactive = await ProductCategory.countDocuments({
      deleted: false,
      status: "inactive",
    })),
    Product.countDocuments({ deleted: false }),
    Product.countDocuments({
      deleted: false,
      status: "active",
    }),
    Product.countDocuments({
      deleted: false,
      status: "inactive",
    }),
    User.countDocuments({ deleted: false }),
    User.countDocuments({
      deleted: false,
      status: "active",
    }),
    User.countDocuments({
      deleted: false,
      status: "inactive",
    }),
    User.countDocuments({ deleted: false }),
    User.countDocuments({
      deleted: false,
      status: "active",
    }),
    User.countDocuments({
      deleted: false,
      status: "inactive",
    }),
  ]);

  res.render("admin/pages/dashboard/index", {
    pageTitle: "Trang tổng quan",
    statistic,
  });
};
