const express = require("express");
const router = express.Router();
const multerUpload = require("../middleware/multerUpload");
const s3Validator = require("../validators/s3Validator");
const s3Controller = require("../controllers/s3Controller");

router.post(
	"/avatar",
	multerUpload.uploadAvatarImg.single("avatar"),
	multerUpload.uploadErrorHandler,
	s3Controller.uploadAvatarImg
);

router.delete(
	"/avatar",
	s3Validator.deleteAvatarValidator,
	s3Controller.deleteAvatarImg
);

router.post(
	"/file",
	multerUpload.uploadFile.single("file"),
	multerUpload.uploadErrorHandler,
	s3Controller.uploadFile
);

module.exports = router;
