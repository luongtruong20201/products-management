const { Router } = require("express");
const controllers = require("../../controllers/admin/user.controller");

const router = Router();

router.get("/", controllers.index);
router.patch("/change-status/:status/:id", controllers.changeStatus);

module.exports = router;
