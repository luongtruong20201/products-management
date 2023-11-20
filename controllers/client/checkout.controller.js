const Cart = require("../../models/cart.model");
const productHelper = require("../../helpers/products");
const Product = require("../../models/product.model");
const Order = require("../../models/order.model");

module.exports.index = async (req, res) => {
  const cartId = req.cookies.cartId;
  const cart = await Cart.findById(cartId);

  if (cart.products.length > 0) {
    for (const product of cart.products) {
      const productId = product.product_id;
      const productInfo = await Product.findOne({ _id: productId }).select(
        "title thumbnail slug price discountPercentage"
      );

      productInfo.priceNew = productHelper.priceNewProduct(productInfo);
      productInfo.total = product.quantity * productInfo.priceNew;
      product.productInfo = productInfo;
    }
  }

  res.render("./client/pages/checkout/index", {
    pageTitle: "Đặt hàng",
    cartDetail: cart,
  });
};

module.exports.order = async (req, res) => {
  const cartId = req.cookies.cartId;
  const userInfo = req.body;
  const cart = await Cart.findById(cartId);

  const products = [];
  if (cart.products.length > 0) {
    for (const item of cart.products) {
      const productInfo = await Product.findById(item.product_id).select(
        "discountPercentage price"
      );
      const product = {
        product_id: item.product_id,
        price: productInfo.price,
        discountPercentage: productInfo.discountPercentage,
        quantity: item.quantity,
      };
      products.push(product);
    }
  }
  const order = new Order({ cartId, userInfo, products });
  await order.save();
  await Cart.updateOne({ _id: cartId }, { products: [] });
  res.redirect(`/checkout/success/${order.id}`);
};

module.exports.success = async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findById(orderId);

    for (const product of order.products) {
      const productInfo = await Product.findById(product.product_id).select(
        "title thumbnail"
      );
      product.productInfo = productInfo;
      product.priceNew = productHelper.priceNewProduct(product);
      product.totalPrice = product.priceNew * product.quantity;
    }

    order.totalPrice = order.products.reduce(
      (sum, item) => sum + item.totalPrice,
      0
    );

    res.render("client/pages/checkout/success", {
      pageTitle: "Đặt hàng thành công",
      order,
    });
  } catch (error) {
    console.log(error);
  }
};
