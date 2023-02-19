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
        cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE"), false);
      } else {
        cb(null, true);
      }
    },
  }),

  uploadVideo: multer({
    limit: {
      // limit file size to 5MB
      fileSize: 1024 * 1024 * 5,
    },
    // FILTER OPTIONS LIKE VALIDATING FILE EXTENSION
    fileFilter(req, file, cb) {
      // only accept mp4 files
      if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
        cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE"), false);
      } else {
        cb(null, true);
      }
    },
  }),

  uploadErrorHandler: (error, req, res, next) => {
    if (error instanceof multer.MulterError) {
      console.log(error.code);
      switch (error.code) {
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
  },
};
