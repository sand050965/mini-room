const session = require("express-session");
const express = require("express");
const participantService = require("../services/participantService");
const roomService = require("../services/roomService");

// meeting room
module.exports = {
  getIntoMeeting: async (req, res) => {
    try {
      let isReadyState = false;
      let participantInfo = null;
      let role = req.session.role;
      const participantId = req.session.participantId;
      const roomId = req.params.roomId;
      const dataId = req.session.dataId;

      const roomCheck = await roomService.getValidRoom({ roomId: roomId });

      //   check if the roomId exists
      if (roomCheck === null) {
        res.render("error");
        return;
      }

      if (role === null || role === undefined) {
        role = "participant";
      }

      if (dataId) {
        participantInfo = await participantService.getParticipantById(dataId);
        isReadyState = participantInfo.isReadyState;
      }

      if (
        isReadyState &&
        roomId === participantInfo.roomId &&
        participantId === participantInfo.participantId
      ) {
        req.session.destroy();
        res.render("room", {
          roomId: participantInfo.roomId,
          participantId: participantInfo.participantId,
          participantName: participantInfo.participantName,
          role: participantInfo.role,
          avatarImgUrl: participantInfo.avatarImgUrl,
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
        role: role,
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

  getToThankyou: async (req, res) => {
    res.render("thankyou");
  },
};
