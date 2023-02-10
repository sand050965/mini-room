const Room = require("../models/Room");

module.exports = {
  getValidRoom: (data) => {
    return Room.findOne({
      $and: [
        { roomId: data.roomId },
        {
          $or: [
            { status: "start" },
            { status: "inUse" },
            { status: "preStart" },
          ],
        },
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
    const room = new Room({
      roomId: data.roomId,
      status: data.status,
    });
    return await room.findOneAndUpdate(
      { roomId: data.roomId },
      { status: data.status }
    );
  },
};
