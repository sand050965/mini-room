const redisClient = require("../utils/redisUtil.js");

module.exports = {
	joinMeetingCache: async (req, res, next) => {
		try {
			const checkRoom = await redisClient.hGet(req.query.roomId, "start");
			if (checkRoom !== null) {
				res.status(200).json({ ok: true });
			}
			next();
		} catch (e) {
			if (e) {
				if (process.env.NODE_ENV !== "development") {
					console.log(e);
				}

				return res
					.status(400)
					.json({ error: true, message: e });
			}
		}
	},
};
