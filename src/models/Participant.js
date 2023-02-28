/** @format */

const mongoose = require("../utils/DBUtil");

const participantSchema = new mongoose.Schema(
	{
		roomId: { type: String, required: true, index: true },
		participantId: { type: String, required: true, index: true },
		participantName: { type: String, required: true, index: true, trim: true },
		avatarImgUrl: {
			type: String,
			required: true,
			default: process.env.DEFAULT_AVATAR_IMG_URL,
		},
		isMuted: { type: Boolean, required: true },
		isStoppedVideo: { type: Boolean, required: true },
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("Participant", participantSchema);
