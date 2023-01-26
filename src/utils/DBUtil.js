const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
require("dotenv").config();

const url = `${process.env.DB_URL}`;

const connectToDB = () => {
  mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  // mongoose.connect(url, {
  //   useNewUrlParser: true,
  //   useFindAndModify: true,
  //   useUnifiedTopology: true,
  //   useCreateIndex: true,
  // });
  const db = mongoose.connection;
  db.on("error", (err) => console.error("Connection Error", err));
  db.once("open", (db) => console.log("Connected to MongoDB"));

  mongoose.connection.once("open", () => {
    console.log("DB connected");
  });
};

const disconnectToDB = () => {
  if (!mongoose.connection) {
    return;
  }

  mongoose.disconnect();

  mongoose.once("close", async () => {
    console.log("Diconnected to database");
  });
};
module.exports = { connectToDB, disconnectToDB };
