const shortid = require("shortid");
const roomService = require("../services/roomService");

module.exports = {
	startMeeting: async (req, res) => {
		try {
			
			let roomId = shortid.generate();

			let checkInUseRoom = null;

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
			} else {
				await roomService.createRoom({
					roomId: roomId,
					status: "start",
				});
			}

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
			const checkValidRoom = await roomService.getRoomCheck(
				{
					roomId: req.query.roomId,
				},
				{
					status: "start",
				}
			);

			if (checkValidRoom === null) {

				return res
					.status(400)
					.json({ error: true, message: "room id doesn't exist!" });
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
