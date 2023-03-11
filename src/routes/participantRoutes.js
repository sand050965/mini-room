const express = require("express");
const router = express.Router();
const participantCache = require("../middleware/participantCache");
const participantValidator = require("../validators/participantValidator");
const participantController = require("../controllers/participantController");

router.get(
	"/all/:roomId",
	participantValidator.getAllParticipantsValidator,
	participantCache.getAllParticipantsCache,
	participantController.getAllParticipants
);

router.get(
	"/:roomId",
	participantValidator.getParticipantValidator,
	participantCache.getParticipantInfoCache,
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
