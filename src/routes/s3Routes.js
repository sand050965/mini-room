/** @format */

const express = require("express");
const router = express.Router();
const multerUpload = require("../middleware/multerUpload");
const s3Validator = require("../validators/s3Validator");
const s3Controller = require("../controllers/s3Controller");

router.use((error, req, res, next) => {
	if (error instanceof multer.MulterError) {
		switch (errer.code) {
			case "LIMIT_FILE_SIZE":
				return res
					.status(400)
					.json({ error: true, message: "File is too large!" });
			case "LIMIT_UNEXPECTED_FILE":
				return res.status(400).json({
					error: true,
					message: "Only accept these file types: [jpg, jpeg, png]!",
				});
		}
	}
});

// upload avatar
router.post(
	"/avatar",
	multerUpload.uploadAvatarImg.single("avatar"),
	multerUpload.uploadErrorHandler,
	s3Controller.uploadAvatarImg
);

// delete avatar
router.delete(
	"/avatar",
	s3Validator.deleteAvatarValidator,
	s3Controller.deleteAvatarImg
);

// upload file
router.post(
	"/file",
	multerUpload.uploadFile.single("file"),
	multerUpload.uploadErrorHandler,
	s3Controller.uploadFile
);

module.exports = router;
