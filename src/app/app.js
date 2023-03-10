"use strict";
const express = require("express");
const compression = require("compression");
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("../swagger/swagger.json");

require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const meetingRoutes = require("../routes/meetingRoutes");
const participantRoutes = require("../routes/participantRoutes");
const roomRoutes = require("../routes/roomRoutes");
const mailRoutes = require("../routes/mailRoutes");
const userRoutes = require("../routes/userRoutes");
const authRoutes = require("../routes/authRoutes");
const s3Routes = require("../routes/s3Routes");
const memberRoutes = require("../routes/memberRoutes");
const canvasRoutes = require("../routes/canvasRoutes");
const errorRoutes = require("../routes/errorRoutes");
const thankyouRoutes = require("../routes/thankyouRoutes");

// view engine setup
const app = express();
app.set("views", path.resolve(__dirname, "../views"));
app.set("view engine", "ejs");

// middlewares
app.use(cors());
app.use(express.static(path.resolve(__dirname, "../public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compression());
app.use(passport.initialize());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/api/participant", participantRoutes);
app.use("/api/room", roomRoutes);
app.use("/api/mail", mailRoutes);
app.use("/api/s3", s3Routes);
app.use("/api/user", userRoutes);
app.use("/auth", authRoutes);
app.use("/canvas", canvasRoutes);
app.use("/error", errorRoutes);
app.use("/member", memberRoutes);
app.use("/thankyou", thankyouRoutes);
app.use("/", meetingRoutes);

app.get("/", (req, res) => {
	res.render("index");
});

module.exports = app;
