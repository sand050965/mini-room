/** @format */

const mailService = require("../services/mailService");

module.exports = {
	sendInviteEmail: async (req, res) => {
		try {
			const mailData = {
				senderName: req.body.senderName,
				recipientEmailArray: req.body.recipientEmailArray,
				roomId: req.body.roomId,
			};
			const result = await mailService.sendEmail(mailData);
			res.status(200).json({ ok: true, result: result });
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
