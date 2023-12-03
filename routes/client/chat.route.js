const { Router } = require("express");
const controllers = require("../../controllers/client/chat.controller");
const middleware = require("../../middlewares/client/chat.middleware");

const router = Router();

router.get("/:roomChatId", middleware.isAccess, controllers.index);

module.exports = router;
