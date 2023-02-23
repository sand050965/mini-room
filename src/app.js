/** @format */

"use strict";
const express = require("express");
const session = require("express-session");
const compression = require("compression");
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const meetingRoutes = require("./routes/meetingRoutes");
const participantRoutes = require("./routes/participantRoutes");
const roomRoutes = require("./routes/roomRoutes");
const mailRoutes = require("./routes/mailRoutes");
const userRoutes = require("./routes/userRoutes");
const s3Routes = require("./routes/s3Routes");
const memberRoutes = require("./routes/memberRoutes");
const thankyouRoutes = require("./routes/thankyouRoutes");

// view engine setup
const app = express();
app.set("views", path.resolve(__dirname, "./views"));
app.set("view engine", "ejs");

// middlewares
app.use(cors());
app.use(express.static(path.resolve(__dirname, "./public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compression());

app.use("/api/participant", participantRoutes);
app.use("/api/room", roomRoutes);
app.use("/api/mail", mailRoutes);
app.use("/api/user", userRoutes);
app.use("/api/s3", s3Routes);
app.use("/member", memberRoutes);
app.use("/thankyou", thankyouRoutes);
app.use("/", meetingRoutes);

// index page
app.get("/", (req, res) => {
	res.render("index");
});

app.use("/test/test", (req, res) => {
	res.render("test");
});

module.exports = app;
