"use strict";
require("dotenv").config();
const app = require("./middleware/app");
const server = require("http").Server(app);
const io = require("socket.io")(server);

const PORT = process.env.PORT || 3000;

// -------------Socket IO-------------
io.on("connection", (socket) => {
  //user join room event
  socket.on("join-room", (roomId, userId, userName) => {
    socket.join(roomId); //user join room event

    socket.to(roomId).emit("user-connected", userId, userName); // emit to users in the room that a new user connected

    // users finished rendering event
    socket.on("finished-render", () => {
      socket.to(roomId).emit("user-finished-render", userId);
    });

    // users mute event
    socket.on("mute", () => {
      socket.to(roomId).emit("user-mute-unmute", userId);
    });

    // users unmute event
    socket.on("unmute", () => {
      socket.to(roomId).emit("user-mute-unmute", userId);
    });

    // users stop sharing video stream event
    socket.on("stop-video", () => {
      socket.to(roomId).emit("user-stop-video", userId);
    });

    // users play video stream event
    socket.on("play-video", () => {
      socket.to(roomId).emit("user-play-video", userId);
    });

    // users send message event
    socket.on("message", (message) => {
      io.to(roomId).emit("create-message", message, userId, userName); // emit to users in the room what message that user sent
    });

    // user disconnect event
    socket.on("disconnect", () => {
      socket.to(roomId).emit("user-disconnected", userId); // emit to users in the room that a user just leave
    });
  });
});

server.listen(PORT, () =>
  console.log(`Server listening on port ${process.env.PORT}`)
);
