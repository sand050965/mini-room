const mongoose = require("../utils/DBUtil");
const bcrypt = require("bcrypt");

const SALT_WORK_FACTOR = 10;

const userSchema = new mongoose.Schema(
	{
		googleId: {
			type: String,
			unique: true,
			sparse: true
		},

		email: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/,
		},

		password: {
			type: String,
			index: true,
			trim: true,
			minLength: 6,
			maxLength: 30,
			match: /^([a-zA-Z0-9@#$%^&+=!]{6,30})$/,
		},

		username: {
			type: String,
			required: true,
			maxLength: 20,
		},

		avatarImgUrl: {
			type: String,
			trim: true,
			required: true,
			default: process.env.DEFAULT_AVATAR_IMG_URL,
		},
	},
	{
		timestamps: true,
	}
);

userSchema.pre("save", async function (next) {
	if (this.googleID) {
		return next();
	}

	if (!this.isModified("password")) {
		return next();
	}

	try {
		const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
		this.password = await bcrypt.hash(this.password, salt);
		return next();
	} catch (err) {
		return next(err);
	}
});

userSchema.methods.comparePassword = async function (password) {
	return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", userSchema);
