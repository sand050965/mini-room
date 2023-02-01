const session = require("express-session");
const express = require("express");
const participantService = require("../services/participantService");

// meeting room
module.exports = {
  getIntoMeeting: async (req, res) => {
    try {
      let isReadyState = false;
      let participantInfo = null;
      let action = req.session.action;
      const userId = req.session.userId;
      const roomId = req.params.roomId;
      const dataId = req.session.dataId;

      if (action === null) {
        action = "join";
      }

      if (dataId) {
        participantInfo = await participantService.getParticipantById(dataId);
        isReadyState = participantInfo.isReadyState;
      }

      if (
        isReadyState &&
        roomId === participantInfo.roomId &&
        userId === participantInfo.userId
      ) {
        req.session.destroy();
        res.render("room", {
          roomId: participantInfo.roomId,
          userId: participantInfo.userId,
          userName: participantInfo.userName,
          audioAuth: participantInfo.audioAuth,
          videoAuth: participantInfo.videoAuth,
          isMuted: participantInfo.isMuted,
          isStoppedVideo: participantInfo.isStoppedVideo,
        });
        return;
      }

      // premeeting
      res.render("premeeting", {
        roomId: roomId,
        action: action,
      });
    } catch (e) {
      if (process.env.NODE_ENV !== "development") {
        console.log(e);
      }
      res
        .status(500)
        .json({ error: true, message: "Sorry, something went wrong!" });
    }
  },
};
