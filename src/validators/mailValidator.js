/** @format */

const JoiUtil = require("../utils/JoiUtil");

module.exports = {
	sendEmailValidator: (req, res, next) => {
		const data = {
			senderName: req.body.senderName,
			recipientEmailArray: req.body.recipientEmailArray,
			roomId: req.body.roomId,
		};

		const { error, value } = JoiUtil.sendEmailSchema.validate(data, {
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
