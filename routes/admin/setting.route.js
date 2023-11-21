const { Router } = require("express");
const controllers = require("../../controllers/admin/setting.controller");
const multer = require("multer");
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");

const router = Router();
const upload = multer();

router.get("/general", controllers.general);

router.patch(
  "/general",
  upload.single("logo"),
  uploadCloud.upload,
  controllers.generalPatch
);

module.exports = router;
