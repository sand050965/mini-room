"use strict";
require("dotenv").config();
const app = require("./app");
const server = require("http").Server(app);
const io = require("socket.io")(server, {
  cors: {
    origin: process.env.SOCKET_IO_ORIGIN,
    method: ["GET", "POST"],
  },
}); 
const fetch = require("cross-fetch");
const PORT = process.env.PORT || 3000;

// -------------Socket IO-------------
io.on("connection", (socket) => {
  //user join room event
  socket.on("join-room", (roomId, participantId, participantName) => {
    socket.join(roomId); //user join room event

    socket.to(roomId).emit("user-connected", participantId, participantName); // emit to users in the room that a new user connected

    // users finished rendering event
    socket.on("finished-render", () => {
      socket.to(roomId).emit("user-finished-render", participantId);
    });

    // users mute event
    socket.on("mute", () => {
      socket.to(roomId).emit("user-mute", participantId);
    });

    // users unmute event
    socket.on("unmute", () => {
      socket.to(roomId).emit("user-unmute", participantId);
    });

    // users stop sharing video stream event
    socket.on("stop-video", () => {
      socket.to(roomId).emit("user-stop-video", participantId);
    });

    // users play video stream event
    socket.on("play-video", () => {
      socket.to(roomId).emit("user-play-video", participantId);
    });

    // users stop sharing screen stream event
    socket.on("stop-screen-share", () => {
      socket.to(roomId).emit("user-stop-screen-share", participantId);
    });

    // users start sharing screen stream event
    // socket.on("start-screen-share", () => {
    //   socket.to(roomId).emit("user-start-screen-share", participantId);
    // });

    // users denied permission to use camera and microphone
    socket.on("denied-media-permission", () => {
      socket.to(roomId).emit("user-denied-media-permission", participantId);
    });

    // users send message event
    socket.on("message", (message, time, avatarImgUrl) => {
      io.to(roomId).emit("user-send-message", {
        message: message,
        time: time,
        avatarImgUrl: avatarImgUrl,
        participantId: participantId,
        participantName: participantName,
      }); // emit to users in the room what message that user sent
    });

    // user disconnect event
    socket.on("disconnect", async () => {
      const response = await fetch("/api/participant", {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          Authorization: auth,
        },
        body: { roomId: roomId, participantId: participantId },
      });
      const data = await response.json();
      socket.to(roomId).emit("user-disconnected", participantId); // emit to users in the room that a user just leave
    });
  });
});

server.listen(PORT, () =>
  console.log(`Server listening on port ${process.env.PORT}`)
);
