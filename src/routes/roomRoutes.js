const express = require("express");
const roomValidator = require("../validators/roomValidator");
const roomController = require("../controllers/roomController");
const router = express.Router();

router.get("/:roomId", roomValidator.getRoomValidator, roomController.getRoom);

router.delete(
  "/room",
  roomValidator.closeRoomValidator,
  roomController.closeRoom
);

router
  .get(
    "/:roomId/:participantId",
    roomValidator.getParticipantValidator,
    roomController.getParticipant
  )
  .delete(
    "/participant",
    roomValidator.participantLeaveValidator,
    roomController.participantLeave
  );

module.exports = router;
