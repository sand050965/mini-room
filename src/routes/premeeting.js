const express = require("express");
const router = express.Router();
const Room =  require("../models/Room");

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
