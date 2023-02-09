require("dotenv").config();
const mongoose = require("mongoose");

const participantSchema = new mongoose.Schema(
  {
    roomId: { type: String, required: true },
    participantId: { type: String, required: true },
    participantName: { type: String, required: true },
    role: { type: String, required: true },
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
    collection: "participant",
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("Participant", participantSchema);
