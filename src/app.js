"use strict";
// require("dotenv").config();
const express = require("express");
const session = require("express-session");
const compression = require("compression");
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session");
const meetingRoutes = require("./routes/meetingRoutes");
const participantRoutes = require("./routes/participantRoutes");
const roomRoutes = require("./routes/roomRoutes");
const mailRoutes = require("./routes/mailRoutes");
const userRoutes = require("./routes/userRoutes");
const memberRoutes = require("./routes/memberRoutes");
const thankyouRoutes = require("./routes/thankyouRoutes");

// view engine setup
const app = express();
app.set("views", path.resolve(__dirname, "./views"));
app.set("view engine", "ejs");

// middlewares
app.use(
  session({
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: true,
  })
);
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
app.use("/member", memberRoutes);
app.use("/thankyou", thankyouRoutes);
app.use("/", meetingRoutes);

// index page
app.get("/", (req, res) => {
  res.render("index");
});

module.exports = app;
