const jwt = require("jsonwebtoken");
const redisClient = require("../utils/redisUtil");
const userService = require("../services/userService.js");

module.exports = {
	googleCallback: async (req, res) => {
		try {
			const profile = req.user;

			let user = null;

			user = await redisClient.hget("User", profile.emails[0].value);

			if (!user) {
				user = await userService.getUser({
					email: profile.emails[0].value,
				});
			}

			if (user) {
				if (user.googleId !== profile.id) {
					await userService.updateUserInfo(
						{
							email: profile.emails[0].value,
						},
						{
							googleId: profile.id,
							username: profile.displayName,
							avatarImgUrl: profile.photos[0].value,
						}
					);

					await redisClient.hSet(
						"User",
						profile.emails[0].value,
						JSON.stringify({
							email: profile.emails[0].value,
							googleId: profile.id,
							username: profile.displayName,
							avatarImgUrl: profile.photos[0].value,
						})
					);
				}
			} else {
				user = await redisClient.hget("User", profile.id);

				if (!user) {
					user = await userService.getUser({
						googleId: profile.id,
					});
				}

				if (!user) {
					user = await userService.postUser({
						googleId: profile.id,
						email: profile.emails[0].value,
						username: profile.displayName,
						avatarImgUrl: profile.photos[0].value,
					});

					await redisClient.hSet(
						"User",
						profile.emails[0].value,
						JSON.stringify({
							googleId: profile.id,
							email: profile.emails[0].value,
							username: profile.displayName,
							avatarImgUrl: profile.photos[0].value,
						})
					);
				}
			}

			const accessToken = await jwt.sign(
				user._doc,
				process.env.JWT_ACCESS_TOKEN_SECRET,
				{
					expiresIn: "7d",
				}
			);

			res
				.cookie("access_token", accessToken, {
					httpOnly: true,
					secure: process.env.NODE_ENV === "production",
					maxAge: 60 * 60 * 60 * 24 * 7,
				})
				.redirect("/");
		} catch (e) {
			if (process.env.NODE_ENV !== "development") {
				console.log(e);
			}
			res.redirect("/");
		}
	},
};
