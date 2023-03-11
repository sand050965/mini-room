const jwt = require("jsonwebtoken");
const userService = require("../services/userService.js");
const redisClient = require("../utils/redisUtil.js");

module.exports = {
	getUserData: async (req, res) => {
		try {
			const userData = await userService.getUser({
				email: req.user.email,
			});

			if (userData === null) {
				return res
					.status(401)
					.json({ error: true, message: "Access token is invalid" });
			}

			await redisClient.hSet("User", req.user.email, JSON.stringify(userData));

			return res.status(200).json({ data: userData });
		} catch (e) {
			if (process.env.NODE_ENV !== "development") {
				console.log(e);
			}
			return res
				.status(500)
				.json({ error: true, message: "Sorry, something went wrong!" });
		}
	},

	signup: async (req, res) => {
		try {
			const userData = {
				email: req.body.email,
				password: req.body.password,
				username: req.body.username,
				avatarImgUrl: req.body.avatarImgUrl,
			};

			const redisUserData = {
				email: req.body.email,
				username: req.body.username,
				avatarImgUrl: req.body.avatarImgUrl,
			};

			await userService.postUser(userData);

			await redisClient.hSet(
				"User",
				req.body.email,
				JSON.stringify(redisUserData)
			);

			return res.status(200).json({ ok: true });
		} catch (e) {
			if (process.env.NODE_ENV !== "development") {
				console.log(e);
			}

			if (e.code === 11000) {
				return res.status(400).json({
					error: true,
					message: "the email has been already registered!",
				});
			}
			return res
				.status(500)
				.json({ error: true, message: "Sorry, something went wrong!" });
		}
	},

	login: async (req, res) => {
		try {
			const user = await userService.putUser({
				email: req.body.email,
			});

			if (!user) {
				return res
					.status(400)
					.json({ error: true, message: "Wrong email or password." });
			}

			const isMatch = await user.comparePassword(req.body.password);

			if (isMatch) {
				const tokenData = {
					email: user.email,
				};

				const accessToken = await jwt.sign(
					tokenData,
					process.env.JWT_ACCESS_TOKEN_SECRET,
					{
						expiresIn: "7d",
					}
				);

				res
					.cookie("access_token", accessToken, {
						httpOnly: true,
						secure: process.env.NODE_ENV === "production",
						maxAge: 60 * 60 * 24 * 7,
					})
					.status(200)
					.json({ ok: true });
			} else {
				return res
					.status(400)
					.json({ error: true, message: "Wrong email or password." });
			}
		} catch (e) {
			if (process.env.NODE_ENV !== "development") {
				console.log(e);
			}
			res
				.status(500)
				.json({ error: true, message: "Sorry, something went wrong!" });
		}
	},

	logout: async (req, res) => {
		try {
			return res
				.clearCookie("access_token", { httpOnly: true })
				.status(200)
				.json({ ok: true });
		} catch (e) {
			if (process.env.NODE_ENV !== "development") {
				console.log(e);
			}
			res
				.status(500)
				.json({ error: true, message: "Sorry, something went wrong!" });
		}
	},

	chageUserInfo: async (req, res) => {
		try {
			const userData = {
				email: req.body.email,
				username: req.body.username,
				avatarImgUrl: req.body.avatarImgUrl,
			};

			await userService.updateUserInfo({ email: req.user.email }, userData);

			await redisClient.hDel("User", req.user.email);

			res.clearCookie("access_token", { httpOnly: true });

			return res
				.status(200)
				.clearCookie("access_token", { httpOnly: true })
				.json({ ok: true });
		} catch (e) {
			if (process.env.NODE_ENV !== "development") {
				console.log(e);
			}
			res
				.status(500)
				.json({ error: true, message: "Sorry, something went wrong!" });
		}
	},

	refreshUserToken: async (req, res) => {
		try {
			let user = null;

			user = await redisClient.hGet("User", req.body.email);

			if (!user) {
				user = await userService.getUser({
					email: req.body.email,
				});

				await redisClient.hSet("User", req.body.email, JSON.stringify(user));
			}

			const tokenData = {
				email: user.email,
			};

			const accessToken = await jwt.sign(
				tokenData,
				process.env.JWT_ACCESS_TOKEN_SECRET,
				{
					expiresIn: "7d",
				}
			);

			return res
				.cookie("access_token", accessToken, {
					httpOnly: true,
					secure: process.env.NODE_ENV === "production",
					maxAge: 60 * 60 * 24 * 7,
				})
				.status(200)
				.json({ ok: true });
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
