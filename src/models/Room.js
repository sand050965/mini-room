const mongoose = require("mongoose");

const roomShcema = new mongoose.Schema(
  {
    roomId: { type: String, required: true },
    status: { type: String, required: true },
  },
  {
    collection: "room",
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("Room", roomShcema);
