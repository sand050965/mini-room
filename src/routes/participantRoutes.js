const express = require("express");
const participantValidator = require("../validators/participantValidator");
const participantController = require("../controllers/participantController");
const router = express.Router();

router.get(
  "/:roomId",
  participantValidator.getAllParticipantsValidator,
  participantController.getAllParticipantsInfo
);

router.get(
  "/:roomId/:participantId",
  participantValidator.getParticipantValidator,
  participantController.getParticipantInfo
);

router.post(
  "/ready",
  participantValidator.insertParticipantValidator,
  participantController.readyToJoin
);

router.get(
  "/",
  participantValidator.getParticipantIdsByNameValidator,
  participantController.searchParticipantName
);

router.delete(
  "/",
  participantValidator.participantLeaveValidator,
  participantController.participantLeave
);

router.delete(
  "/all",
  participantValidator.deleteAllParticipantsValidator,
  participantController.deleteAllParticipants
);

module.exports = router;
