const { Router } = require("express");
const controllers = require("../../controllers/client/user.controller");
const validate = require("../../validates/client/user.validate");
const middlewares = require("../../middlewares/client/auth.middleware");

const router = Router();

router.get("/register", controllers.register);
router.post("/register", validate.registerPost, controllers.registerPost);
router.get("/login", controllers.login);
router.post("/login", validate.loginPost, controllers.loginPost);
router.get("/logout", controllers.logout);
router.get("/password/forgot", controllers.forgotPassword);
router.post("/password/forgot", controllers.forgotPasswordPost);
router.get("/password/otp", controllers.otpPassword);
router.post("/password/otp", controllers.otpPasswordPost);
router.get("/password/reset", controllers.resetPassword);
router.post(
  "/password/reset",
  validate.resetPasswordPost,
  controllers.resetPasswordPost
);
router.get("/info", middlewares.requireAuth, controllers.info);
router.get("/edit", middlewares.requireAuth, controllers.edit);
router.patch(
  "/edit",
  middlewares.requireAuth,
  validate.editPatch,
  controllers.editPatch
);

module.exports = router;
