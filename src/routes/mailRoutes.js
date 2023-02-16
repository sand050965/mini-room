const express = require("express");
const mailController = require("../controllers/mailController.js");
const router = express.Router();

// send mail
router.post("/", mailController.sendInviteEmail);

module.exports = router;
