/** @format */

const AWS = require("aws-sdk");
require("dotenv").config();

const s3 = new AWS.S3({
	accessKeyId: process.env.AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_ID,
	region: process.env.AWS_S3_REGION,
});

module.exports = {
	postFile: async (params) => {
		const data = await s3.upload(params).promise();
		return data;
	},

	deleteAvatarImg: async (params) => {},
};
