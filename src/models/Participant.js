require("dotenv").config();
const mongoose = require("mongoose");

const participantSchema = new mongoose.Schema(
  {
    roomId: { type: String, required: true },
    userId: { type: String, required: true },
    userName: { type: String, required: true },
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
