/** @format */

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
	"/before/:roomId",
	participantValidator.getParticipantValidator,
	participantController.getBeforeParticipants
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

router.delete(
	"/all",
	participantValidator.deleteAllParticipantsValidator,
	participantController.deleteAllParticipants
);

module.exports = router;
