const jwt = require("jsonwebtoken");

module.exports = {
	verifyAccessToken: (req, res, next) => {
		try {
			const { access_token } = req.cookies;
			if (access_token === null || access_token === undefined) {
				return res
					.status(401)
					.json({ ok: true, message: "No access token found!", data: null });
			}
			const user = jwt.verify(
				access_token,
				process.env.JWT_ACCESS_TOKEN_SECRET
			);
			req.user = user;
			next();
		} catch (e) {
			if (process.env.NODE_ENV !== "development") {
				console.log(e);
			}

			return res
				.status(403)
				.json({ error: true, message: "Invalid access token!" });
		}
	},

	verifyLogoutAccessToken: (req, res, next) => {
		try {
			const { access_token } = req.cookies;
			if (access_token === undefined || access_token === null) {
				return res.status(204).json({ ok: true });
			}
			next();
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
