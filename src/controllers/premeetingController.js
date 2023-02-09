require("dotenv").config();
const { v4: uuidv4 } = require("uuid");
const session = require("express-session");
const express = require("express");
const participantService = require("../services/participantService");

module.exports = {
  startMeeting: async (req, res) => {
    try {
      let newRoomId = uuidv4();
      //   check if the roomId is duplicated
      const checkRoom = await participantService.getAllParticipants(newRoomId);
      if (checkRoom.length !== 0) {
        newRoomId = uuidv4();
      }
      req.session.role = "host";
      res.status(200).json({ roomId: newRoomId });
    } catch (e) {
      if (process.env.NODE_ENV !== "development") {
        console.log(e);
      }
      res
        .status(500)
        .json({ error: true, message: "Sorry, something went wrong!" });
    }
  },

  joinMeeting: async (req, res) => {
    try {
      const joinRoomId = req.body.roomId;
      //   check if the roomId exists
      const checkRoom = await participantService.getAllParticipants(joinRoomId);
      if (checkRoom.length === 0) {
        res
          .status(400)
          .json({ error: true, message: "room id doesn't exist!" });
      }
      req.session.role = "participant";
      res.status(200).json({ ok: true });
    } catch (e) {
      if (process.env.NODE_ENV !== "development") {
        console.log(e);
      }
      res
        .status(500)
        .json({ error: true, message: "Sorry, something went wrong!" });
    }
  },

  readyToJoin: async (req, res) => {
    try {
      const participantData = {
        roomId: req.body.roomId,
        participantId: req.body.participantId,
        participantName: req.body.participantName,
        role: req.body.role,
        avatarImgUrl: req.body.avatarImgUrl,
        isMuted: req.body.isMuted,
        isStoppedVideo: req.body.isStoppedVideo,
        isReadyState: req.body.isReadyState,
      };
      //   check if the userId exists
      const checkParticipant = await participantService.getParticipant(
        participantData
      );
      if (checkParticipant !== null) {
        res.status(409).json({ ok: false, message: "user id is duplicated!" });
      }
      const participant = await participantService.insertParticipant(
        participantData
      );
      req.session.participantId = req.body.participantId;
      req.session.dataId = participant.id;
      res.status(200).json({ ok: true });
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
