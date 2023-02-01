const express = require("express");
const router = express.Router();
const premeetingValidator = require("../validators/premeetingValidator");
const premeetingController = require("../controllers/premeetingController");

router.get("/start", premeetingController.startMeeting);
router.post("/join", premeetingController.joinMeeting);
router.post(
  "/ready",
  premeetingValidator.participantValidator,
  premeetingController.readyToJoin
);

module.exports = router;
