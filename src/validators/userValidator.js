const JoiUtil = require("../utils/JoiUtil");

module.exports = {
	getUserValidator: (req, res, next) => {
		const data = {
			email: req.user.email,
		};

		const { error, value } = JoiUtil.getUserSchema.validate(data, {
			abortEarly: false,
		});

		if (error) {
			if (process.env.NODE_ENV !== "development") {
				console.log(error);
			}

			return res
				.status(401)
				.json({ error: true, message: error.details[0].message });
		}

		next();
	},

	signupValidator: (req, res, next) => {
		const data = {
			email: req.body.email,
			password: req.body.password,
			username: req.body.username,
			avatarImgUrl: req.body.avatarImgUrl,
		};

		const { error, value } = JoiUtil.signupSchema.validate(data, {
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

	loginValidator: (req, res, next) => {
		const data = { email: req.body.email, password: req.body.password };

		const { error, value } = JoiUtil.loginSchema.validate(data, {
			abortEarly: false,
		});

		if (error) {
			console.log(error);
			return res.status(400).send(error.details[0].message);
		}

		next();
	},

	changeUserInfoValidator: (req, res, next) => {
		const data = {
			email: req.body.email,
			username: req.body.username,
			avatarImgUrl: req.body.avatarImgUrl,
		};

		const { error, value } = JoiUtil.changeUserInfoSchema.validate(data, {
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

	refreshUserValidator: (req, res, next) => {
		const data = {
			email: req.body.email,
		};

		const { error, value } = JoiUtil.getUserSchema.validate(data, {
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
