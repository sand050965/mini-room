const Participant = require("../models/Participant");

module.exports = {
  getParticipantById: (dataId) => {
    return Participant.findById(dataId);
  },

  getAllParticipantsCnt: (roomId) => {
    return Participant.countDocuments({ roomId: roomId });
  },

  getBeforeParticipants: (data) => {
    return Participant.countDocuments({
      roomId: data.roomId,
      createdAt: { $lte: data.createdAt },
    });
  },

  getParticipant: (data) => {
    return Participant.findOne({
      roomId: data.roomId,
      participantId: data.participantId,
    });
  },

  getParticipantIdsByName: (data) => {
    const regex = new RegExp(data.participantName, "i");
    return Participant.find({
      roomId: data.roomId,
      participantName: regex,
    }).select("participantId");
  },

  insertParticipant: async (data) => {
    const participant = new Participant({
      roomId: data.roomId,
      participantId: data.participantId,
      participantName: data.participantName,
      role: data.role,
      avatarImgUrl: data.avatarImgUrl,
      isMuted: data.isMuted,
      isStoppedVideo: data.isStoppedVideo,
      isReadyState: data.isReadyState,
    });
    return await participant.save();
  },

  deleteParticipant: async (data) => {
    await Participant.findOneAndRemove({
      roomId: data.roomId,
      participantId: data.participantId,
    });
  },

  deleteAllParticipants: async (data) => {
    await Participant.deleteMany({
      roomId: data.roomId,
    });
  },
};
