const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const Room =  require("../models/Room");

// start meeting
router.get("/start", (req, res) => {
  const newRoomId = uuidv4();
  req.session.action = "start";
  res.status(200).json({ roomId: newRoomId });
});

// join meeting
router.post("/join", (req, res) => {
  const joinRoomId = req.body.roomId;
  req.session.action = "join";
  // validation...
  res.status(200).json({ ok: true });
});

// ready to join
router.post("/ready", async (req, res) => {
  let room = new Room({
    roomId: req.body.roomId,
    userId: req.body.userId,
    userName: req.body.userName,
    audioAuth: req.body.audioAuth,
    videoAuth: req.body.videoAuth,
    isMuted: req.body.isMuted,
    isStoppedVideo: req.body.isStoppedVideo,
    isReadyState: req.body.isReadyState,
  });
  try {
    room = await room.save();
    req.session.dataId = room.id;
    req.session.userId = req.body.userId;
    res.status(200).json({ ok: true });
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
