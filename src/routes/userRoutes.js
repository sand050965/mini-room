const express = require("express");
const router = express.Router();
const userValidator = require("../validators/userValidator");
const JWTverify = require("../middleware/JWTverify");
const userController = require("../controllers/userController");

router.get("/", userController.getIntoUser);
router
  .get("/auth", JWTverify.verifyAccessToken, userController.getUserData)
  .post("/auth", userValidator.signupValidator, userController.signup)
  .put("/auth", userValidator.loginValidator, userController.login)
  .delete("/auth", userController.logout);

router.post(
  "/avatar",
  userValidator.changeUserAvatarValidator,
  userController.chageUserAvatar
);
router.post(
  "/name",
  userValidator.changeUsernameValidator,
  userController.chageUsername
);

module.exports = router;
