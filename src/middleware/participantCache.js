module.exports = {
	getAllParticipantsCache: (req, res, next) => {
		const roomId = req.params.roomId;

		redisClient.hget(roomId, (err, data) => {
			if (err) {
				if (process.env.NODE_ENV !== "development") {
					console.log(error);
				}

				return res
					.status(400)
					.json({ error: true, message: error.details[0].message });
			}

			if (data !== null) {
				return res
					.status(200)
					.json({ data: { participantCnt: data.length() } });
			} else {
				next();
			}
		});
	},

	getParticipantInfoCache: (req, res, next) => {
		const roomId = req.params.roomId;

		redisClient.hget(roomId, (err, data) => {
			if (err) {
				if (process.env.NODE_ENV !== "development") {
					console.log(error);
				}

				return res
					.status(400)
					.json({ error: true, message: error.details[0].message });
			}

			if (data !== null) {
				return res
					.status(200)
					.json({ data: { participantCnt: data.length() } });
			} else {
				next();
			}
		});
	},

	readyToJoinCache: (req, res, next) => {
		const roomId = req.params.roomId;

		redisClient.hget(roomId, (err, data) => {
			if (err) {
				if (process.env.NODE_ENV !== "development") {
					console.log(error);
				}

				return res
					.status(400)
					.json({ error: true, message: error.details[0].message });
			}

			if (data !== null) {
				return res
					.status(200)
					.json({ data: { participantCnt: data.length() } });
			} else {
				next();
			}
		});
	},

	searchParticipantCache: (req, res, next) => {
		const roomId = req.params.roomId;

		redisClient.hget(roomId, (err, data) => {
			if (err) {
				if (process.env.NODE_ENV !== "development") {
					console.log(error);
				}

				return res
					.status(400)
					.json({ error: true, message: error.details[0].message });
			}

			if (data !== null) {
				return res
					.status(200)
					.json({ data: { participantCnt: data.length() } });
			} else {
				next();
			}
		});
	},

	participantLeaveCache: (req, res, next) => {
		const roomId = req.params.roomId;

		redisClient.hget(roomId, (err, data) => {
			if (err) {
				if (process.env.NODE_ENV !== "development") {
					console.log(error);
				}

				return res
					.status(400)
					.json({ error: true, message: error.details[0].message });
			}

			if (data !== null) {
				return res
					.status(200)
					.json({ data: { participantCnt: data.length() } });
			} else {
				next();
			}
		});
	},
};
