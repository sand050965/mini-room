/** @format */

const express = require("express");
const meetingController = require("../controllers/meetingController");
const router = express.Router();

// meeting room
router.get("/:roomId", meetingController.getIntoMeeting);

module.exports = router;
