const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
mongoose.set("strictQuery", false);
const uri = process.env.DB_URI;

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
});

mongoose.connection.once("close", async () => {
  console.log("Diconnected to database");
});

mongoose.connection.once("err", (err) => {
  console.log("Connection Error", err);
});

module.exports = mongoose;
