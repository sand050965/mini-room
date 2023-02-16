require("dotenv").config();
const mongoose = require("../utils/DBUtil");

const participantSchema = new mongoose.Schema(
  {
    roomId: { type: String, required: true, index: true },
    participantId: { type: String, required: true, index: true },
    participantName: { type: String, required: true, index: true, trim: true },
    role: { type: String, required: true, enum: ["host", "participant"] },
    avatarImgUrl: {
      type: String,
      required: true,
      default: process.env.DEFAULT_AVATAR_IMG_URL,
    },
    isMuted: { type: Boolean, required: true },
    isStoppedVideo: { type: Boolean, required: true },
    isReadyState: { type: Boolean, required: true, default: false },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Participant", participantSchema);
