const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  roomId: { type: String, required: true },
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  audioAuth: { type: Boolean, required: true },
  videoAuth: { type: Boolean, required: true },
  isMuted: { type: Boolean, required: true },
  isStoppedVideo: { type: Boolean, required: true },
  isReadyState: { type: Boolean, required: true, default: false },
});

module.exports = mongoose.model("Room", roomSchema);
