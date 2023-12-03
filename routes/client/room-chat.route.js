const { Router } = require("express");
const controllers = require("../../controllers/client/room-chat.controller");

const router = Router();

router.get("/", controllers.index);
router.get("/create", controllers.create);
router.post("/create", controllers.createPost);

module.exports = router;
