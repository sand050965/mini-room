/** @format */

const Room = require("../models/Room");

module.exports = {
	getValidRoom: async (data) => {
		return await Room.findOne({
			$and: [
				{ roomId: data.roomId },
				{ status: ["start", "preStart", "inUse"] },
			],
		});
	},

	createRoom: async (data) => {
		const room = new Room(data);
		return await room.save();
	},

	updateRoomStatus: async (condition, data) => {
		return await Room.updateOne(condition, data);
	},
};
