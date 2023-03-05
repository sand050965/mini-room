const shortid = require("shortid");
const JoiUtil = require("../utils/JoiUtil");

module.exports = {
	roomIdValidator: (req, res, next) => {
		const data = { roomId: req.params.roomId };

		if (!shortid.isValid(req.params.roomId)) {
			return res.render("error");
		}

		const { error, value } = JoiUtil.roomIdSchema.validate(data, {
			abortEarly: false,
		});

		if (error) {
			if (process.env.NODE_ENV !== "development") {
				console.log(error);
			}

			return res.render("error");
		}

		next();
	},
};
