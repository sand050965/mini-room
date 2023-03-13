const redis = require("redis");

const client = redis.createClient({
	url: process.env.AWS_ELASTICACHE_REDIS_HOST,
});

client.on("connect", () => {
	console.log("Connected to Redis");
});

client.on("error", (err) => {
	console.log("Redis Client Error", err);
});

client.connect();

module.exports = client;
