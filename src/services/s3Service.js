const s3 = require("../utils/s3Util.js");

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
