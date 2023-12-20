const { Router } = require("express");
const controllers = require("../../controllers/admin/user.controller");

const router = Router();

router.get("/", controllers.index);
router.patch("/change-status/:status/:id", controllers.changeStatus);
router.get("/detail/:id", controllers.detail);
router.delete("/delete/:id", controllers.delete);

module.exports = router;
