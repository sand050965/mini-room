/** @format */

"use strict";
const app = require("./app");
const server = require("http").Server(app);
const io = require("socket.io")(server);
const PORT = process.env.PORT || 3000;
const participantService = require("./services/participantService");

// -------------Socket IO-------------
io.on("connection", (socket) => {
	//user join room event
	socket.on(
		"join-room",
		(roomId, participantId, participantName, avatarImgUrl) => {
			socket.join(roomId); //user join room event

			socket
				.to(roomId)
				.emit("user-connected", participantId, participantName, avatarImgUrl); // emit to users in the room that a new user connected

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
				io.to(roomId).emit("user-stop-screen-share", participantId);
			});

			// users denied permission to use camera and microphone
			socket.on("denied-media-permission", () => {
				socket.to(roomId).emit("user-denied-media-permission", participantId);
			});

			// users send message event
			socket.on("message", (msgObj) => {
				io.to(roomId).emit("user-send-message", {
					message: msgObj.message,
					time: msgObj.time,
					avatarImgUrl: msgObj.avatarImgUrl,
					participantId: participantId,
					participantName: participantName,
				}); // emit to users in the room what message that user sent
			});

			// users attach file event
			socket.on("file-share", (fileObj) => {
				io.to(roomId).emit("user-share-file", {
					fileUrl: fileObj.fileUrl,
					fileName: fileObj.fileName,
					fileSize: fileObj.fileSize,
					fileType: fileObj.fileType,
					time: fileObj.time,
					avatarImgUrl: fileObj.avatarImgUrl,
					participantId: participantId,
					participantName: participantName,
				});
			}); // emit to users in the room what file that user attach

			// user disconnect event
			socket.on("disconnect", async () => {
				await participantService.deleteParticipant({
					roomId: roomId,
					participantId: participantId,
				});
				io.to(roomId).emit("user-disconnected", participantId, participantName); // emit to users in the room that a user just leave
			});
		}
	);
});

server.listen(PORT, () =>
	console.log(`Server listening on port ${process.env.PORT}`)
);
