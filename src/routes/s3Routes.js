const express = require("express");
const router = express.Router();
require("dotenv").config();
const fileUpload = require("../middleware/fileUpload");
const s3Controller = require("../controllers/s3Controller");

// upload avatar
router.post(
  "/avatar",
  fileUpload.uploadAvatarImg.single("avatar"),
  s3Controller.uploadAvatarImg
);

// upload video
router.post(
  "/video",
  fileUpload.uploadVideo.single("video"),
  s3Controller.uploadVideo
);

module.exports = router;
