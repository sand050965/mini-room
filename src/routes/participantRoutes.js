const express = require("express");
const router = express.Router();
const participantValidator = require("../validators/participantValidator");
const participantController = require("../controllers/participantController");

router.get(
	"/all/:roomId",
	participantValidator.getAllParticipantsValidator,
	participantController.getAllParticipants
);

router.get(
	"/:roomId",
	participantValidator.getParticipantValidator,
	participantController.getParticipantInfo
);

router.post(
	"/ready",
	participantValidator.readyToJoinValidator,
	participantController.readyToJoin
);

router.get(
	"/",
	participantValidator.searchParticipantValidator,
	participantController.searchParticipant
);

router.delete(
	"/",
	participantValidator.participantLeaveValidator,
	participantController.participantLeave
);

module.exports = router;
