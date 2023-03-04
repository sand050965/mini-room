/** @format */

const shortid = require("shortid");
const roomService = require("../services/roomService");

module.exports = {
	startMeeting: async (req, res) => {
		try {
			let roomId = shortid.generate();

			//   check whether the room_id status is closed
			const checkInvalidRoom = await roomService.getRoomCheck(
				{
					roomId: roomId,
				},
				{
					status: "closed",
				}
			);

			//   check whether the room_id is duplicated
			const checkValidRoom = await roomService.getRoomCheck(
				{
					roomId: roomId,
				},
				{
					status: "start",
				}
			);

			if (checkValidRoom !== null) {
				roomId = shortid.generate();
			} else if (checkInvalidRoom !== null) {
				await roomService.updateRoomStatus(
					{
						roomId: roomId,
					},
					{
						status: "start",
					}
				);
			}

			await roomService.createRoom({
				roomId: roomId,
				status: "start",
			});

			res.status(200).json({ roomId: roomId });
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
			//   check if the roomId exists
			const checkRoom = await roomService.getValidRoom({
				roomId: req.query.roomId,
			});
			if (checkRoom === null) {
				res
					.status(400)
					.json({ error: true, message: "room id doesn't exist!" });
				return;
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
				{ status: "close" }
			);
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
