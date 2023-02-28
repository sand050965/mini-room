/** @format */

const nodemailer = require("nodemailer");
const path = require("path");

// require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

module.exports = nodemailer.createTransport({
	host: process.env.MAIL_HOST,
	port: process.env.MAIL_PORT,
	secure: true,
	auth: {
		user: process.env.MAIL_USER,
		pass: process.env.MAIL_PASSWORD,
	},
});
