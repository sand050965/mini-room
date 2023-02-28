const express = require("express");
const router = express.Router();
const roomValidator = require("../validators/roomValidator");
const roomController = require("../controllers/roomController");

router.get("/start", roomController.startMeeting);
router.get(
  "/join",
  roomValidator.joinRoomValidator,
  roomController.joinMeeting
);
router.post(
  "/",
  roomValidator.closeRoomValidator,
  roomController.closeRoom
);

module.exports = router;
