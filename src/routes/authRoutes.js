const express = require("express");
const router = express.Router();
const passport = require("passport");
const authController = require("../controllers/authController");

require("../middleware/passport")(passport);

router.get(
	"/google",
	passport.authenticate("google", {
		prompt: "select_account",
	})
);

router.get(
	"/google/callback",
	passport.authenticate("google", {
		failureRedirect: "/",
		session: false,
	}),
	authController.googleCallback
);

module.exports = router;
