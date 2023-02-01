require("dotenv").config();
const express = require("express");
const participantService = require("../services/participantService");

module.exports = {
  getRoomInfo: async (req, res) => {
    try {
      const roomId = req.params.roomId;
      const roomInfo = await participantService.getAllParticipants(roomId);
      res.status(200).json({ data: roomInfo });
    } catch (e) {
      if (process.env.NODE_ENV !== "development") {
        console.log(e);
      }
      res
        .status(500)
        .json({ error: true, message: "Sorry, something went wrong!" });
    }
  },

  getParticipantInfo: async (req, res) => {
    try {
      const participantData = {
        roomId: req.params.roomId,
        userId: req.params.userId,
      };
      const participantInfo = await participantService.getParticipant(
        participantData
      );
      res.status(200).json({ data: participantInfo });
    } catch (e) {
      if (process.env.NODE_ENV !== "development") {
        console.log(e);
      }
      res
        .status(500)
        .json({ error: true, message: "Sorry, something went wrong!" });
    }
  },

  participantLeave: async (req, res) => {
    try {
      const participantData = {
        roomId: req.params.roomId,
        userId: req.params.userId,
      };
      await participantService.deleteParticipant(participantData);
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

  closeRoom: async (req, res) => {
    try {
      const roomId = req.params.roomId;
      await participantService.deleteAllParticipants(roomId);
      res.status(200).json({ ok: true });
    } catch (e) {
      if (process.env.NODE_ENV !== "development") {
        console.log(e);
      }
      res
        .status(500)
        .json({ error: true, message: "Sorry, something went wrong." });
    }
  },
};
