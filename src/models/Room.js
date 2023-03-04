/** @format */

const mongoose = require("../utils/DBUtil");

const roomShcema = new mongoose.Schema(
	{
		roomId: { type: String, required: true, unique: true, trim: true },
		status: {
			type: String,
			required: true,
			index: true,
			enum: ["start", "closed"],
			trim: true,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("Room", roomShcema);
