"use strict";
const session = require("express-session");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const cors = require("cors");

const express = require("express");
const { v4: uuidv4 } = require("uuid");
const { ExpressPeerServer } = require("peer");

const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const peerServer = ExpressPeerServer(server, {
  debug: true,
});

app.set("views", `${__dirname}/views`);
app.set("view engine", "ejs");

app.use(express.static(`${__dirname}/public`));
app.use(cookieParser("12345jvhjjhvjhvjllloo998fy6789"));
app.use("/peerjs", peerServer);
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

// test page
app.get("/test", (req, res) => {
  res.render("test");
});

// start meeting
app.get("/api/start", (req, res) => {
  const newRoomId = uuidv4();
  req.session.action = "start";
  res.status(200).json({ roomId: newRoomId });
});

// join meeting
app.post("/api/join", jsonParser, (req, res) => {
  const joinRoomId = req.body.roomId;
  req.session.action = "join";
  // validation...
  res.status(200).json({ ok: true });
});

//premeeting ready
app.post("/api/premeeting/ready", jsonParser, (req, res) => {
  const userId = req.body.userId;
  const participantName = req.body.participantName;
  const audioAuth = req.body.audioAuth;
  const videoAuth = req.body.videoAuth;
  const isMuted = req.body.isMuted;
  const isStoppedVideo = req.body.isStoppedVideo;
  req.session.userId = userId;
  req.session.participantName = participantName;
  req.session.audioAuth = audioAuth;
  req.session.videoAuth = videoAuth;
  req.session.isMuted = isMuted;
  req.session.isStoppedVideo = isStoppedVideo;
  req.session.isReadyState = true;
  res.status(200).json({ ok: true });
});

// meeting room
app.get("/:roomId", (req, res) => {
  const roomId = req.params.roomId;
  const userId = req.session.userId;
  const isReadyState = req.session.isReadyState;
  const participantName = req.session.participantName;
  const audioAuth = req.session.audioAuth;
  const videoAuth = req.session.videoAuth;
  const isMuted = req.session.isMuted;
  const isStoppedVideo = req.session.isStoppedVideo;

  let action = req.session.action;

  if (action === null) {
    action = "join";
  }

  if (!isReadyState) {
    // premeeting
    req.session.action = null;
    res.render("premeeting", {
      roomId: roomId,
      action: action,
    });
    return;
  }
  res.render("room", {
    roomId: roomId,
    userId: userId,
    participantName: participantName,
    audioAuth: audioAuth,
    videoAuth: videoAuth,
    isMuted: isMuted,
    isStoppedVideo: isStoppedVideo,
  });
  req.session = null;
});

// -------------Socket IO-------------
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
