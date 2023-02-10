require("dotenv").config();
const { v4: uuidv4 } = require("uuid");
const session = require("express-session");
const express = require("express");
const roomService = require("../services/roomService");

module.exports = {
  startMeeting: async (req, res) => {
    try {
      let roomId = uuidv4();
      //   check if the roomId is duplicated
      const checkData = {
        roomId: roomId,
      };
      const checkRoom = await roomService.getValidRoom(checkData);

      if (checkRoom !== null) {
        roomId = uuidv4();
      }

      const roomData = {
        roomId: roomId,
        status: "start",
      };
      await roomService.createRoom(roomData);

      req.session.role = "host";
      res.status(200).json({ roomId: roomId });
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
      const joinRoomId = req.query.roomId;
      //   check if the roomId exists
      const checkRoom = await roomService.getValidRoom(joinRoomId);
      if (checkRoom === null) {
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

  closeRoom: async (req, res) => {
    try {
      const roomData = {
        roomId: req.query.roomId,
        status: "close",
      };
      await roomService.updateRoomStatus(roomData);
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
