/** @format */

const express = require("express");
const crypto = require("crypto");
const util = require("util");
const randomBytes = util.promisify(crypto.randomBytes);
require("dotenv").config();
const s3Service = require("../services/s3Service");

module.exports = {
	uploadAvatarImg: async (req, res) => {
		try {
			const rawBytes = await randomBytes(16);
			const imgName = rawBytes.toString("hex");
			const params = {
				Bucket: process.env.AWS_BUCKET_NAME,
				Key: `images/${imgName}`,
				Body: req.file.buffer,
				ACL: "public-read",
				ContentType: req.file.mimetype,
			};
			const data = await s3Service.postFile(params);
			return res.status(200).json({ data: { url: data.Location } });
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

	deleteFiles: async (req, res) => {
		try {
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
			return res.status(200).json({ data: { url: data.Location } });
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
