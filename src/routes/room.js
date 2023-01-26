const express = require("express");
const bodyParser = require("body-parser");
const Room = require("../models/Room");
const router = express.Router();
const jsonParser = bodyParser.json();

// meeting room
router.get("/:roomId", async (req, res) => {
  let action = req.session.action;
  let isReadyState = false;
  let participantInfo = null;
  let userId = req.session.userId;
  const roomId = req.params.roomId;
  const dataId = req.session.dataId;

  if (action === null) {
    action = "join";
  }

  if (dataId) {
    participantInfo = await Room.findById(dataId);
    isReadyState = participantInfo.isReadyState;
  }

  if (isReadyState && userId === participantInfo.userId) {
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
});

// get meeting room info
router.get("/room/:roomId", async (req, res) => {
  const roomId = req.params.roomId;
  const roomInfo = await Room.find({ roomId: roomId });
  res.status(200).json({ data: roomInfo });
});

// delete participant from meeting room


module.exports = router;
