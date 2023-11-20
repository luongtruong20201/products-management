const { Router } = require("express");
const controllers = require("../../controllers/client/checkout.controller");
const router = Router();

router.get("/", controllers.index);
router.post("/order", controllers.order);
router.get("/success/:orderId", controllers.success);
module.exports = router;
