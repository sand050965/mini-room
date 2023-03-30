const crypto = require("crypto");
const util = require("util");
const randomBytes = util.promisify(crypto.randomBytes);
const s3Service = require("../services/s3Service");

module.exports = {
	uploadAvatarImg: async (req, res) => {
		try {
			const rawBytes = await randomBytes(16);
			const imgName = rawBytes.toString("hex");
			const params = {
				Bucket: process.env.AWS_BUCKET_NAME,
				Key: `avatars/${imgName}`,
				Body: req.file.buffer,
				ACL: "public-read",
				ContentType: req.file.mimetype,
			};
			const data = await s3Service.postFile(params);
			const location = data.Location.replace(
				process.env.AWS_S3_URL,
				process.env.AWS_CLOUDFRONT_URL
			);
			return res.status(200).json({ data: { url: location } });
		} catch (e) {
			if (process.env.NODE_ENV !== "development") {
				console.log(e);
			}

			if (e === "uploadError") {
				return res.status(400).json({
					error: true,
					message: "Failed to upload file due to some error!",
				});
			}

			return res
				.status(500)
				.json({ error: true, message: "Sorry, something went wrong!" });
		}
	},

	deleteAvatarImg: async (req, res) => {
		try {
			const avatarImgPath = req.body.avatarImgUrl.replace(
				process.env.AWS_S3_URL_PREFIX,
				""
			);
			const params = {
				Bucket: process.env.AWS_BUCKET_NAME,
				Key: `${avatarImgPath}`,
			};
			const s3Result = await s3Service.deleteFile(params);
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

	uploadFile: async (req, res) => {
		try {
			const rawBytes = await randomBytes(16);
			const fileName = rawBytes.toString("hex");
			const params = {
				Bucket: process.env.AWS_BUCKET_NAME,
				Key: `files/${fileName}`,
				Body: req.file.buffer,
				ACL: "public-read",
				ContentType: req.file.mimetype,
			};
			const data = await s3Service.postFile(params);
			const location = data.Location.replace(
				process.env.AWS_S3_URL,
				process.env.AWS_CLOUDFRONT_URL
			);
			return res.status(200).json({ data: { url: location } });
		} catch (e) {
			if (process.env.NODE_ENV !== "development") {
				console.log(e);
			}

			return res
				.status(500)
				.json({ error: true, message: "Sorry, something went wrong!" });
		}
	},
};
