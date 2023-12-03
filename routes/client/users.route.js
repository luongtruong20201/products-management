const { Router } = require("express");
const controllers = require("../../controllers/client/users.controller");

const router = Router();

router.get("/not-friend", controllers.notFriend);
router.get("/request", controllers.request);
router.get("/accept", controllers.accept);
router.get("/friends", controllers.friends);

module.exports = router;
