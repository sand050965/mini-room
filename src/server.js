"use strict";
const app = require("./app/app");
const server = require("http").Server(app);
const io = require("socket.io")(server);
const PORT = process.env.PORT || 8080;
const redisClient = require("./utils/redisUtil");
const participantService = require("./services/participantService");
const roomService = require("./services/roomService");

io.on("connection", (socket) => {
	socket.on(
		"join-room",
		(roomId, participantId, participantName, avatarImgUrl) => {
			socket.join(roomId);

			socket
				.to(roomId)
				.emit("user-connected", participantId, participantName, avatarImgUrl);

			socket.on("finished-render", () => {
				socket.to(roomId).emit("user-finished-render", participantId);
			});

			socket.on("mute", () => {
				socket.to(roomId).emit("user-mute", participantId);
			});

			socket.on("unmute", () => {
				socket.to(roomId).emit("user-unmute", participantId);
			});

			socket.on("stop-video", () => {
				socket.to(roomId).emit("user-stop-video", participantId);
			});

			socket.on("play-video", () => {
				socket.to(roomId).emit("user-play-video", participantId);
			});

			socket.on("stop-screen-share", () => {
				io.to(roomId).emit("user-stop-screen-share", participantId);
			});

			socket.on("denied-media-permission", () => {
				socket.to(roomId).emit("user-denied-media-permission", participantId);
			});

			socket.on("message", (msgObj) => {
				io.to(roomId).emit("user-send-message", {
					message: msgObj.message,
					time: msgObj.time,
					avatarImgUrl: msgObj.avatarImgUrl,
					participantId: participantId,
					participantName: participantName,
				});
			});

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
			});

			socket.on("disconnect", async (reason) => {
				if (reason === "transport close") {
					await participantService.deleteParticipant({
						roomId: roomId,
						participantId: participantId,
					});

					await redisClient.hDel(
						`Participant_${roomId}`,
						participantId
					);

					const participantCheck =
						await participantService.getAllParticipantsCnt({
							roomId: roomId,
						});

					if (!participantCheck) {
						await roomService.updateRoomStatus(
							{
								roomId: roomId,
							},
							{ status: "closed" }
						);
						await redisClient.del(`Room_${roomId}`);
					}
				}

				if (
					reason === "client namespace disconnect" ||
					reason === "transport close"
				) {
					io.to(roomId).emit(
						"user-disconnected",
						participantId,
						participantName
					);
				}
			});
		}
	);
});

server.listen(PORT, () =>
	console.log(`Server listening on port ${process.env.PORT}`)
);
