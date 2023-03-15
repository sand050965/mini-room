const redis = require("redis");

const client = redis.createClient(
	process.env.AWS_ELASTICACHE_REDIS_PORT,
	process.env.AWS_ELASTICACHE_REDIS_URL
);

client.on("connect", () => {
	console.log("Connected to Redis");
});

client.on("error", (err) => {
	console.log("Redis Client Error", err);
});

client.connect();

module.exports = client;
