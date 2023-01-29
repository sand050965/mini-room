const express = require("express");
const Room = require("../models/Room");
const router = express.Router();

// get meeting room info
router.get("/:roomId", async (req, res) => {
  const roomId = req.params.roomId;
  const roomInfo = await Room.find({ roomId: roomId });
  res.status(200).json({ data: roomInfo });
});

// get username from room
router.get("/:roomId/:userId", async (req, res) => {
  const roomId = req.params.roomId;
  const userId = req.params.userId;
  const userInfo = await Room.findOne({ roomId: roomId, userId: userId });
  res.status(200).json({ data: userInfo });
});

// delete participant from meeting room
router.delete("/:roomId/:userId", async (req, res) => {
  const roomId = req.params.roomId;
  const roomInfo = await Room.find({ roomId: roomId });
  res.status(200).json({ data: roomInfo });
});

module.exports = router;
