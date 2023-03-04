/** @format */

const shortid = require("shortid");
const JoiUtil = require("../utils/JoiUtil");

module.exports = {
	joinRoomValidator: (req, res, next) => {
		const data = { roomId: req.query.roomId };

		if (!shortid.isValid(req.query.roomId)) {
			return res
				.status(400)
				.json({ error: true, message: "Room id is invalid" });
		}

		const { error, value } = JoiUtil.roomIdSchema.validate(data, {
			abortEarly: false,
		});

		if (error) {
			if (process.env.NODE_ENV !== "development") {
				console.log(error);
			}

			return res
				.status(400)
				.json({ error: true, message: error.details[0].message });
		}

		next();
	},

	closeRoomValidator: (req, res, next) => {
		const data = { roomId: req.body.roomId };

		if (!shortid.isValid(req.query.roomId)) {
			return res
				.status(400)
				.json({ error: true, message: "Room id is invalid" });
		}

		const { error, value } = JoiUtil.roomIdSchema.validate(data, {
			abortEarly: false,
		});

		if (error) {
			if (process.env.NODE_ENV !== "development") {
				console.log(error);
			}

			return res
				.status(400)
				.json({ error: true, message: error.details[0].message });
		}

		next();
	},
};
