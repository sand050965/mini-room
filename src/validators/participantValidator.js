/** @format */

const shortid = require("shortid");
const JoiUtil = require("../utils/JoiUtil");

module.exports = {
	readyToJoinValidator: (req, res, next) => {
		const data = {
			roomId: req.body.roomId,
			participantId: req.body.participantId,
			participantName: req.body.participantName,
			avatarImgUrl: req.body.avatarImgUrl,
			isMuted: req.body.isMuted,
			isStoppedVideo: req.body.isStoppedVideo,
		};

		if (!shortid.isValid(req.body.roomId)) {
			return res
				.status(400)
				.json({ error: true, message: "Room id is invalid" });
		}

		const { error, value } = JoiUtil.readyToJoinSchema.validate(data, {
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

	getParticipantValidator: (req, res, next) => {
		const data = {
			roomId: req.params.roomId,
			participantId: req.query.participantId,
		};

		if (!shortid.isValid(req.params.roomId)) {
			return res
				.status(400)
				.json({ error: true, message: "Room id is invalid" });
		}

		const { error, value } = JoiUtil.roomParticipantSchema.validate(data, {
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

	getAllParticipantsValidator: (req, res, next) => {
		const data = { roomId: req.params.roomId };

		if (!shortid.isValid(req.params.roomId)) {
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

	searchParticipantValidator: (req, res, next) => {
		const data = {
			roomId: req.query.roomId,
			participantName: req.query.participantName,
		};

		if (!shortid.isValid(req.query.roomId)) {
			return res
				.status(400)
				.json({ error: true, message: "Room id is invalid" });
		}

		const { error, value } = JoiUtil.searchParticipantSchema.validate(data, {
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

	participantLeaveValidator: (req, res, next) => {
		const data = {
			roomId: req.body.roomId,
			participantId: req.body.participantId,
		};

		if (!shortid.isValid(req.body.roomId)) {
			return res
				.status(400)
				.json({ error: true, message: "Room id is invalid" });
		}

		const { error, value } = JoiUtil.roomParticipantSchema.validate(data, {
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
