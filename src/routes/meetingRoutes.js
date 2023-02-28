/** @format */

const express = require("express");
const router = express.Router();
const meetingValidator = require("../validators/meetingValidator");
const meetingController = require("../controllers/meetingController");

// meeting room
router.get(
	"/:roomId",
	meetingValidator.roomIdValidator,
	meetingController.getIntoMeeting
);

module.exports = router;
