const multer = require("multer");

module.exports = {
  uploadAvatarImg: multer({
    limit: {
      // limit file size to 5MB
      fileSize: 1024 * 1024 * 5,
    },
    // FILTER OPTIONS LIKE VALIDATING FILE EXTENSION
    fileFilter(req, file, cb) {
      // only accept jpg, jpeg, png files
      if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
        cb(new Error("file is not of the correct type!"), false);
      }
      cb(null, true);
    },
  }),

  uploadVideo: multer({
    limit: {
      // limit file size to 5MB
      fileSize: 1024 * 1024 * 5,
    },
    // FILTER OPTIONS LIKE VALIDATING FILE EXTENSION
    fileFilter(req, file, cb) {
      // only accept jpg, jpeg, png files
      if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
        cb(null, false);
      }
      cb(null, true);
    },
  }),
};
