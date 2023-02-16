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
    const room = new Room({
      roomId: data.roomId,
      status: data.status,
    });
    return await room.save();
  },

  updateRoomStatus: async (data) => {
    return await Room.updateOne(
      { roomId: data.roomId },
      { status: data.status }
    );
  },
};
