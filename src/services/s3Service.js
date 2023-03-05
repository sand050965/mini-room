const AWS = require("aws-sdk");

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

	deleteFile: async (params) => {
		const result = await s3.deleteObject(params).promise();
		return result;
	},
};
