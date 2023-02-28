/** @format */

const participantService = require("../services/participantService");

module.exports = {
	readyToJoin: async (req, res) => {
		try {
			const participant = await participantService.insertParticipant({
				roomId: req.body.roomId,
				participantId: req.body.participantId,
				participantName: req.body.participantName,
				avatarImgUrl: req.body.avatarImgUrl,
				isMuted: req.body.isMuted,
				isStoppedVideo: req.body.isStoppedVideo,
			});

			return res
				.status(200)
				.cookie("dataId", participant.id, {
					httpOnly: true,
					secure: process.env.NODE_ENV === "production",
					maxAge: 60 * 60 * 60,
				})
				.cookie("participantId", req.body.participantId, {
					httpOnly: true,
					secure: process.env.NODE_ENV === "production",
					maxAge: 60 * 60 * 60,
				})
				.json({ ok: true });
		} catch (e) {
			if (process.env.NODE_ENV !== "development") {
				console.log(e);
			}

			return res
				.status(500)
				.json({ error: true, message: "Sorry, something went wrong!" });
		}
	},

	getAllParticipants: async (req, res) => {
		try {
			const participantCnt = await participantService.getAllParticipantsCnt({
				roomId: req.params.roomId,
			});
			return res.status(200).json({ data: { participantCnt: participantCnt } });
		} catch (e) {
			if (process.env.NODE_ENV !== "development") {
				console.log(e);
			}
			res
				.status(500)
				.json({ error: true, message: "Sorry, something went wrong!" });
		}
	},

	getBeforeParticipants: async (req, res) => {
		try {
			const participantInfo = await participantService.getParticipant({
				roomId: req.params.roomId,
				participantId: req.query.participantId,
			});
			const beforeParticipantCnt =
				await participantService.getBeforeParticipants(participantInfo);
			return res
				.status(200)
				.json({ data: { beforeParticipantCnt: beforeParticipantCnt } });
		} catch (e) {
			if (process.env.NODE_ENV !== "development") {
				console.log(e);
			}
			return res
				.status(500)
				.json({ error: true, message: "Sorry, something went wrong!" });
		}
	},

	getParticipantInfo: async (req, res) => {
		try {
			const participantInfo = await participantService.getParticipant({
				roomId: req.params.roomId,
				participantId: req.query.participantId,
			});
			return res.status(200).json({ data: participantInfo });
		} catch (e) {
			if (process.env.NODE_ENV !== "development") {
				console.log(e);
			}
			return res
				.status(500)
				.json({ error: true, message: "Sorry, something went wrong!" });
		}
	},

	searchParticipant: async (req, res) => {
		try {
			const participantIds = await participantService.getParticipantIdsByName({
				roomId: req.query.roomId,
				participantName: req.query.participantName,
			});

			let participantIdArray = [];

			for (const id of participantIds) {
				participantIdArray.push(id.participantId);
			}
			return res.status(200).json({ data: participantIdArray });
		} catch (e) {
			if (process.env.NODE_ENV !== "development") {
				console.log(e);
			}
			return res
				.status(500)
				.json({ error: true, message: "Sorry, something went wrong!" });
		}
	},

	participantLeave: async (req, res) => {
		try {
			await participantService.deleteParticipant({
				roomId: req.body.roomId,
				participantId: req.body.participantId,
			});
			return res.status(200).json({ ok: true });
		} catch (e) {
			if (process.env.NODE_ENV !== "development") {
				console.log(e);
			}
			return res
				.status(500)
				.json({ error: true, message: "Sorry, something went wrong!" });
		}
	},

	deleteAllParticipants: async (req, res) => {
		try {
			await participantService.deleteAllParticipants({
				roomId: req.body.roomId,
			});
			return res.status(200).json({ ok: true });
		} catch (e) {
			if (process.env.NODE_ENV !== "development") {
				console.log(e);
			}
			return res
				.status(500)
				.json({ error: true, message: "Sorry, something went wrong." });
		}
	},
};
