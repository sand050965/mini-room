/** @format */

require("dotenv").config();
const JoiUtil = require("../utils/joiUtil");

module.exports = {
	deleteAvatarValidator: (req, res, next) => {
		const data = {
			avatarImgUrl: req.body.avatarImgUrl,
		};

		const { error, value } = JoiUtil.deleteAvatarSchema.validate(data, {
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
