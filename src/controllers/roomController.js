const shortid = require("shortid");
const redisClient = require("../utils/redisUtil.js");
const roomService = require("../services/roomService");

module.exports = {
	startMeeting: async (req, res) => {
		try {
			let roomId = shortid.generate();

			let checkInUseRoom;

			checkInUseRoom = await roomService.getRoomCheck(
				{
					roomId: roomId,
				},
				{
					status: "start",
				}
			);

			while (checkInUseRoom !== null) {
				roomId = shortid.generate();
				checkInUseRoom = await roomService.getRoomCheck(
					{
						roomId: roomId,
					},
					{
						status: "start",
					}
				);
			}

			const checkInvalidRoom = await roomService.getRoomCheck(
				{
					roomId: roomId,
				},
				{
					status: "closed",
				}
			);

			if (checkInvalidRoom !== null) {
				await roomService.updateRoomStatus(
					{
						roomId: roomId,
					},
					{
						status: "start",
					}
				);
				await redisClient.del(`Room_${roomId}`);
			} else {
				await roomService.createRoom({
					roomId: roomId,
					status: "start",
				});
			}

			await redisClient.set(`Room_${roomId}`, "start");

			return res.status(200).json({ data: { roomId: roomId } });
		} catch (e) {
			if (process.env.NODE_ENV !== "development") {
				console.log(e);
			}
			res
				.status(500)
				.json({ error: true, message: "Sorry, something went wrong!" });
		}
	},

	joinMeeting: async (req, res) => {
		try {
			let checkValidRoom = null;

			checkValidRoom = await redisClient.get(`Room_${req.query.roomId}`);

			if (checkValidRoom === null) {
				checkValidRoom = await roomService.getRoomCheck(
					{
						roomId: req.query.roomId,
					},
					{
						status: "start",
					}
				);

				if (checkValidRoom === null) {
					await redisClient.set(`Room_${req.query.roomId}`, "start");

					return res
						.status(400)
						.json({ error: true, message: "room id doesn't exist!" });
				}
			}

			res.status(200).json({ ok: true });
		} catch (e) {
			if (process.env.NODE_ENV !== "development") {
				console.log(e);
			}
			res
				.status(500)
				.json({ error: true, message: "Sorry, something went wrong!" });
		}
	},

	closeRoom: async (req, res) => {
		try {
			await roomService.updateRoomStatus(
				{
					roomId: req.query.roomId,
				},
				{ status: "closed" }
			);
			await redisClient.del(`Room_${req.query.roomId}`);
			res.status(200).json({ ok: true });
		} catch (e) {
			if (process.env.NODE_ENV !== "development") {
				console.log(e);
			}
			res
				.status(500)
				.json({ error: true, message: "Sorry, something went wrong!" });
		}
	},
};
