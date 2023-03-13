const redisClient = require("../utils/redisUtil.js");

module.exports = {
	getAllParticipantsCache: async (req, res, next) => {
		try {
			const participantCnt = await redisClient.hLen(
				`Participant_${req.params.roomId}`
			);
			
			if (participantCnt) {
				return res
					.status(200)
					.json({ data: { participantCnt: participantCnt } });
			} else {
				next();
			}
		} catch (e) {
			if (e) {
				if (process.env.NODE_ENV !== "development") {
					console.log(e);
				}

				return res.status(400).json({ error: true, message: e });
			}
		}
	},

	getParticipantInfoCache: async (req, res, next) => {
		try {
			const participantInfo = await redisClient.hGet(
				`Participant_${req.params.roomId}`,
				req.query.participantId
			);

			if (participantInfo) {
				return res.status(200).json({ data: JSON.parse(participantInfo) });
			} else {
				next();
			}
		} catch (e) {
			if (e) {
				if (process.env.NODE_ENV !== "development") {
					console.log(e);
				}

				return res.status(400).json({ error: true, message: e });
			}
		}
	},
};
