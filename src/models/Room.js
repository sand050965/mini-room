const mongoose = require("mongoose");

const roomShcema = new mongoose.Schema({
  roomId: { type: String, required: true },
  status: { type: String, required: true },
});

module.exports = mongoose.model("Room", roomShcema);
