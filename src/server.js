"use strict";
const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const { ExpressPeerServer } = require("peer");
const { connectToDB, disconnectToDB } = require("./utils/DBUtil");
const premeetingRouter = require("./routes/premeeting");
const roomRouter = require("./routes/room");

// app, socket io, peer js and port config
const app = express();
const port = process.env.PORT || 3000;
const server = require("http").Server(app);
const io = require("socket.io")(server);
const peerServer = ExpressPeerServer(server, {
  debug: true,
});

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
app.use("/peerjs", peerServer);
app.use("/api/premeeting", premeetingRouter);
app.use("/", roomRouter);

// DB connection
connectToDB();

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
app.post("/api/join", (req, res) => {
  const joinRoomId = req.body.roomId;
  req.session.action = "join";
  // validation...
  res.status(200).json({ ok: true });
});

// -------------Socket IO-------------
io.on("connection", (socket) => {
  socket.on("join-room", (roomId, userId, userName) => {
    socket.join(roomId);
    socket.to(roomId).emit("user-connected", userId, userName);
    socket.on("disconnect", () => {
      socket.to(roomId).emit("user-disconnected", userId);
    });
  });
});

server.listen(port);
