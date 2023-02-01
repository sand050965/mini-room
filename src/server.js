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
