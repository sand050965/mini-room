/** @format */

const express = require("express");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const userService = require("../services/userService.js");

module.exports = {
	googleCallback: async (req, res) => {
		try {
			const { user } = req;

			// check if the user already exists
			const accessToken = await jwt.sign(
				user._doc,
				process.env.JWT_ACCESS_TOKEN_SECRET,
				{
					expiresIn: "7d",
				}
			);

			res
				.cookie("access_token", accessToken, {
					httpOnly: true,
					secure: process.env.NODE_ENV === "production",
					maxAge: 60 * 60 * 24 * 7,
				})
				.redirect("/");
		} catch (e) {
			if (process.env.NODE_ENV !== "development") {
				console.log(e);
			}
			res.redirect("/");
		}
	},
};
