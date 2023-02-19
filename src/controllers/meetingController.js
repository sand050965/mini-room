const session = require("express-session");
const express = require("express");
require("dotenv").config();
const participantService = require("../services/participantService");
const roomService = require("../services/roomService");

// meeting room
module.exports = {
  getIntoMeeting: async (req, res) => {
    try {
      let participantInfo = null;
      const { participantId, dataId } = req.cookies;
      const roomId = req.params.roomId;

      const roomCheck = await roomService.getValidRoom({ roomId: roomId });

      //   check if the roomId exists
      if (roomCheck === null) {
        return res.render("error");
      }

      if (dataId) {
        participantInfo = await participantService.getParticipantById(dataId);

        if (
          roomId === participantInfo.roomId &&
          participantId === participantInfo.participantId
        ) {
          res.clearCookie("participantId");
          res.clearCookie("dataId");
          return res.render("room", {
            roomId: participantInfo.roomId,
            participantId: participantInfo.participantId,
            participantName: participantInfo.participantName,
            avatarImgUrl: participantInfo.avatarImgUrl,
            audioAuth: participantInfo.audioAuth,
            videoAuth: participantInfo.videoAuth,
            isMuted: participantInfo.isMuted,
            isStoppedVideo: participantInfo.isStoppedVideo,
          });
        }
      }

      // premeeting
      return res.render("premeeting", {
        roomId: roomId,
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
