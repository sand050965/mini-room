"use strict";
const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
require("dotenv").config();
const cors = require("cors");
const { connectToDB } = require("./utils/DBUtil");
const premeetingRouter = require("./routes/premeetingRoute");
const roomRouter = require("./routes/roomRoute");
const pageRouter = require("./routes/pageRoute");

// app, socket io, peer js and port config
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);

app.set("views", `${__dirname}/views`);
app.set("view engine", "ejs");

// middlewares
app.use(cors());
app.use(
  session({
    secret: "test",
    resave: true,
    saveUninitialized: true,
  })
);

app.use(express.static(`${__dirname}/public`));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/", pageRouter);
app.use("/api/premeeting", premeetingRouter);
app.use("/api/room", roomRouter);

// DB connection
connectToDB();

// index page
app.get("/", (req, res) => {
  res.render("index");
});

// -------------Socket IO-------------
io.on("connection", (socket) => {
  socket.on("join-room", (roomId, userId, userName) => {
    socket.join(roomId);
    socket.to(roomId).emit("user-connected", userId, userName);
    socket.on("message", (message) => {
      io.to(roomId).emit("create-message", message, userId, userName);
    });
    socket.on("disconnect", () => {
      socket.to(roomId).emit("user-disconnected", userId);
    });
  });
});

server.listen(process.env.PORT || 3000);
