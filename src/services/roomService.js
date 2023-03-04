/** @format */

const Room = require("../models/Room");

module.exports = {
	getRoomCheck: async (data, condition) => {
		return await Room.findOne({
			$and: [data, condition],
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
