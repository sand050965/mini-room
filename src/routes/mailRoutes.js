const express = require("express");
const mailValidator = require("../validators/mailValidator");
const mailController = require("../controllers/mailController");
const router = express.Router();

router.post(
	"/",
	mailValidator.sendEmailValidator,
	mailController.sendInviteEmail
);

module.exports = router;
