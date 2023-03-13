const AWS = require("aws-sdk");

module.exports = new AWS.S3({
	accessKeyId: process.env.AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.AWS_SECRET_KEY,
	region: process.env.AWS_S3_REGION,
});
