const express = require("express");
require("dotenv").config();
const participantService = require("../services/participantService");

module.exports = {
  readyToJoin: async (req, res) => {
    try {
      const participantData = {
        roomId: req.body.roomId,
        participantId: req.body.participantId,
        participantName: req.body.participantName,
        avatarImgUrl: req.body.avatarImgUrl,
        isMuted: req.body.isMuted,
        isStoppedVideo: req.body.isStoppedVideo,
      };

      const participant = await participantService.insertParticipant(
        participantData
      );

      return res
        .status(200)
        .cookie("dataId", participant.id, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 60 * 60,
        })
        .cookie("participantId", req.body.participantId, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 60 * 60,
        })
        .json({ ok: true });
    } catch (e) {
      if (process.env.NODE_ENV !== "development") {
        console.log(e);
      }

      return res
        .status(500)
        .json({ error: true, message: "Sorry, something went wrong!" });
    }
  },

  getAllParticipants: async (req, res) => {
    try {
      const roomId = req.params.roomId;
      const participantCnt = await participantService.getAllParticipantsCnt(
        roomId
      );
      return res.status(200).json({ data: { participantCnt: participantCnt } });
    } catch (e) {
      if (process.env.NODE_ENV !== "development") {
        console.log(e);
      }
      res
        .status(500)
        .json({ error: true, message: "Sorry, something went wrong!" });
    }
  },

  getBeforeParticipantsInfo: async (req, res) => {
    try {
      const participantData = {
        roomId: req.params.roomId,
        participantId: req.query.participantId,
      };
      const participantInfo = await participantService.getParticipant(
        participantData
      );
      participantData.createdAt = participantInfo.createdAt;
      const beforeParticipantCnt =
        await participantService.getBeforeParticipants(participantData);
      return res
        .status(200)
        .json({ data: { beforeParticipantCnt: beforeParticipantCnt } });
    } catch (e) {
      if (process.env.NODE_ENV !== "development") {
        console.log(e);
      }
      return es
        .status(500)
        .json({ error: true, message: "Sorry, something went wrong!" });
    }
  },

  getParticipantInfo: async (req, res) => {
    try {
      const participantData = {
        roomId: req.params.roomId,
        participantId: req.query.participantId,
      };
      const participantInfo = await participantService.getParticipant(
        participantData
      );
      return res.status(200).json({ data: participantInfo });
    } catch (e) {
      if (process.env.NODE_ENV !== "development") {
        console.log(e);
      }
      return res
        .status(500)
        .json({ error: true, message: "Sorry, something went wrong!" });
    }
  },

  searchParticipantName: async (req, res) => {
    try {
      const participantData = {
        roomId: req.query.roomId,
        participantName: req.query.participantName,
      };

      const participantIds = await participantService.getParticipantIdsByName(
        participantData
      );

      let participantIdArray = [];

      for (const id of participantIds) {
        participantIdArray.push(id.participantId);
      }
      return res.status(200).json({ data: participantIdArray });
    } catch (e) {
      if (process.env.NODE_ENV !== "development") {
        console.log(e);
      }
      return res
        .status(500)
        .json({ error: true, message: "Sorry, something went wrong!" });
    }
  },

  participantLeave: async (req, res) => {
    try {
      const participantData = {
        roomId: req.body.roomId,
        participantId: req.body.participantId,
      };
      await participantService.deleteParticipant(participantData);
      return res.status(200).json({ ok: true });
    } catch (e) {
      if (process.env.NODE_ENV !== "development") {
        console.log(e);
      }
      return res
        .status(500)
        .json({ error: true, message: "Sorry, something went wrong!" });
    }
  },

  deleteAllParticipants: async (req, res) => {
    try {
      const roomId = req.body.roomId;
      await participantService.deleteAllParticipants(roomId);
      return res.status(200).json({ ok: true });
    } catch (e) {
      if (process.env.NODE_ENV !== "development") {
        console.log(e);
      }
      return res
        .status(500)
        .json({ error: true, message: "Sorry, something went wrong." });
    }
  },
};
