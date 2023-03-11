const express = require("express");
const router = express.Router();
const JWTverify = require("../middleware/JWTverify");
const userCache = require("../middleware/userCache");
const userValidator = require("../validators/userValidator");
const userController = require("../controllers/userController");

router
	.get(
		"/auth",
		JWTverify.verifyAccessToken,
		userValidator.getUserValidator,
		userCache.getUserDataCache,
		userController.getUserData
	)
	.post("/auth", userValidator.signupValidator, userController.signup)
	.put("/auth", userValidator.loginValidator, userController.login)
	.delete("/auth", JWTverify.verifyLogoutAccessToken, userController.logout);

router.put(
	"/info",
	JWTverify.verifyAccessToken,
	userValidator.changeUserInfoValidator,
	userController.chageUserInfo
);

router.put(
	"/token",
	userValidator.refreshUserValidator,
	userController.refreshUserToken
);

module.exports = router;
