const Participant = require("../models/Participant");

module.exports = {
  getParticipantById: (dataId) => {
    return Participant.findById(dataId);
  },

  getAllParticipants: (roomId) => {
    return Participant.find({ roomId: roomId });
  },

  getParticipant: (data) => {
    return Participant.find({ roomId: data.roomId, userId: data.userId });
  },

  insertParticipant: (data) => {
    const participant = new Participant({
      roomId: data.roomId,
      userId: data.userId,
      userName: data.userName,
      isMuted: data.isMuted,
      isStoppedVideo: data.isStoppedVideo,
      isReadyState: data.isReadyState,
    });
    return participant.save();
  },

  deleteParticipant: (data) => {
    Participant.deleteOne({
      roomId: data.roomId,
      userId: data.userId,
    });
  },

  deleteAllParticipants: (data) => {
    Participant.deleteOne({
      roomId: data.roomId,
      userId: data.serId,
    });
  },
};
