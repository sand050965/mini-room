const redisClient = require("../utils/redisUtil");

module.exports = {
	getUserDataCache: async (req, res, next) => {
		try {
			const userData = await redisClient.hGet("User", req.user.email);
			if (userData !== null) {
				return res.status(200).json({ data: JSON.parse(userData) });
			} else {
				next();
			}
		} catch (e) {
			if (e) {
				if (process.env.NODE_ENV !== "development") {
					console.log(e);
				}

				return res
					.status(400)
					.json({ error: true, message: e.details[0].message });
			}
		}
	},
};
