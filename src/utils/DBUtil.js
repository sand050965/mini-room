const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

mongoose.connect(process.env.DB_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

mongoose.connection.once("open", () => {
	console.log("Connected to MongoDB");
});

mongoose.connection.once("close", async () => {
	console.log("Diconnected to database");
});

mongoose.connection.once("err", (err) => {
	console.log("Connection Error", err);
});

module.exports = mongoose;
