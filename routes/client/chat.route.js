const { Router } = require("express");
const controllers = require("../../controllers/client/chat.controller");
const router = Router();

router.get("/", controllers.index);

module.exports = router;
