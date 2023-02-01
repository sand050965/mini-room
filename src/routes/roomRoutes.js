const express = require("express");
const roomValidator = require("../validators/roomValidator");
const roomController = require("../controllers/roomController");
const router = express.Router();

router
  .get("/:roomId", roomValidator.roomIdValidator, roomController.getRoomInfo)
  .delete("/:roomId", roomValidator.roomIdValidator, roomController.closeRoom);

router
  .get(
    "/:roomId/:userId",
    roomValidator.roomIdAndUserIdValidator,
    roomController.getParticipantInfo
  )
  .delete(
    "/:roomId/:userId",
    roomValidator.roomIdAndUserIdValidator,
    roomController.participantLeave
  );

module.exports = router;
