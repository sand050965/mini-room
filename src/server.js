"use strict";
const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const session = require("express-session");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

app.set("views", `${__dirname}/views`);
app.set("view engine", "ejs");

app.use(express.static(`${__dirname}/public`));
app.use(
  session({
    secret: "test",
    resave: false,
    saveUninitialized: true,
  })
);

const jsonParser = bodyParser.json();

// index page
app.get("/", (req, res) => {
  res.render("index");
});

// start meeting
app.get("/api/start", (req, res) => {
  const newRoomId = uuidv4();
  req.session.action = "start";
  res.status(200).json({ roomId: newRoomId });
});

// join meeting
app.post("/api/join", jsonParser, (req, res) => {
  const joinRoomId = req.params.roomId;
  req.session.action = "join";
  // validation...
  res.status(200).json({ ok: true });
});

//premeeting confirm
app.post("/api/confirm", jsonParser, (req, res) => {
  req.session.isChecked = true;
  res.status(200).json({ ok: true });
});

// meeting room
app.get("/:roomId", (req, res) => {
  const roomId = req.params.roomId;
  const isChecked = req.session.check;
  let action = req.session.action;

  if (action === null) {
    action = "join";
  }

  if (!req.session.isChecked) {
    // premeeting
    res.render("premeeting", { roomId: roomId, action: action });
  }

  res.render("room", { roomId: room });
});

// -------------socket io-------------
io.on("connection", (socket) => {
  socket.on("join-room", (roomId, userId) => {
    socket.join(roomId);
    socket.to(roomId).emit("user-connected", userId);
    socket.on("disconnect", () => {
      socket.to(roomId).emit("user-disconnected", userId);
    });
  });
});

server.listen(3000);
