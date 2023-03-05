const Participant = require("../models/Participant");

module.exports = {
	getParticipantById: async (data) => {
		return await Participant.findById(data);
	},

	getAllParticipantsCnt: async (data) => {
		return await Participant.countDocuments(data);
	},

	getParticipant: async (data) => {
		return await Participant.findOne(data);
	},

	getParticipantIdsByName: async (data) => {
		const regex = new RegExp(data.participantName, "i");
		return await Participant.find({
			roomId: data.roomId,
			participantName: regex,
		}).select("participantId");
	},

	insertParticipant: async (data) => {
		const participant = new Participant(data);
		return await participant.save();
	},

	deleteParticipant: async (data) => {
		return await Participant.deleteOne(data);
	},
};
