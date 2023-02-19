const Participant = require("../models/Participant");

module.exports = {
  getParticipantById: async (dataId) => {
    return await Participant.findById(dataId);
  },

  getAllParticipantsCnt: async (roomId) => {
    return await Participant.countDocuments({ roomId: roomId });
  },

  getBeforeParticipants: async (data) => {
    return await Participant.countDocuments({
      roomId: data.roomId,
      createdAt: { $lte: data.createdAt },
    });
  },

  getParticipant: async (data) => {
    return await Participant.findOne({
      roomId: data.roomId,
      participantId: data.participantId,
    });
  },

  getParticipantIdsByName: async (data) => {
    const regex = new RegExp(data.participantName, "i");
    return await Participant.find({
      roomId: data.roomId,
      participantName: regex,
    }).select("participantId");
  },

  insertParticipant: async (data) => {
    const participant = new Participant({
      roomId: data.roomId,
      participantId: data.participantId,
      participantName: data.participantName,
      avatarImgUrl: data.avatarImgUrl,
      isMuted: data.isMuted,
      isStoppedVideo: data.isStoppedVideo,
      isReadyState: data.isReadyState,
    });
    return await participant.save();
  },

  deleteParticipant: async (data) => {
    return await Participant.deleteOne({
      roomId: data.roomId,
      participantId: data.participantId,
    });
  },

  deleteAllParticipants: async (data) => {
    return await Participant.deleteMany({
      roomId: data.roomId,
    });
  },
};
