/** @format */

const User = require("../models/User");

module.exports = {
	getUser: async (data) => {
		return await User.findOne(data).select(
			"_id googleId email username avatarImgUrl"
		);
	},

	getUserByGoogleId: async (data) => {
		return await User.findOne(data).select(
			"_id googleId email username avatarImgUrl"
		);
	},

	putUser: async (data) => {
		return await User.findOne(data).select("email password");
	},

	postUser: async (data) => {
		const user = new User(data);
		return await user.save();
	},

	updateUserInfo: async (data) => {
		return await User.updateOne(
			{ email: data.originEmail },
			{
				email: data.email,
				username: data.username,
				avatarImgUrl: data.avatarImgUrl,
			}
		);
	},

	updateGoogleId: async (data) => {
		return await User.updateOne(
			{ email: data.email },
			{
				googleId: data.googleId,
				username: data.username,
				avatarImgUrl: data.avatarImgUrl,
			}
		);
	},
};
