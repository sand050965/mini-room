/** @format */

const express = require("express");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const userService = require("../services/userService.js");

module.exports = {
	getIntoUser: async (req, res) => {
		return res.render("user");
	},

	getUserData: async (req, res) => {
		try {
			const userData = await userService.getUser({
				email: req.user.email,
			});
			return res.status(200).json({ data: userData });
		} catch (e) {
			if (config.get("nodeEnv") !== "development") {
				console.log(e);
			}
			return res
				.status(500)
				.json({ error: true, message: "Sorry, something went wrong!" });
		}
	},

	signup: async (req, res) => {
		try {
			const userData = {
				email: req.body.email,
				password: req.body.password,
				username: req.body.username,
				avatarImgUrl: req.body.avatarImgUrl,
			};
			await userService.postUser(userData);
			return res.status(200).json({ ok: true });
		} catch (e) {
			if (process.env.NODE_ENV !== "development") {
				console.log(e);
			}

			if (e.code === 11000) {
				return res.status(400).json({
					error: true,
					message: "the email has been already registered!",
				});
			}
			return res
				.status(500)
				.json({ error: true, message: "Sorry, something went wrong!" });
		}
	},

	login: async (req, res) => {
		try {
			const user = await userService.putUser({
				email: req.body.email,
			});

			if (!user) {
				return res
					.status(400)
					.json({ error: true, message: "Wrong email or password." });
			}

			const isMatch = await user.comparePassword(req.body.password);

			if (isMatch) {
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
					.status(200)
					.json({ ok: true });
			} else {
				return res
					.status(400)
					.json({ error: true, message: "Wrong email or password." });
			}
		} catch (e) {
			if (process.env.NODE_ENV !== "development") {
				console.log(e);
			}
			res
				.status(500)
				.json({ error: true, message: "Sorry, something went wrong!" });
		}
	},

	logout: async (req, res) => {
		try {
			const { access_token } = req.cookies;
			if (access_token === undefined || access_token === null) {
				return res.status(204).json({ ok: true });
			}
			res.clearCookie("access_token", { httpOnly: true });
			return res.status(200).json({ ok: true });
		} catch (e) {
			if (process.env.NODE_ENV !== "development") {
				console.log(e);
			}
			res
				.status(500)
				.json({ error: true, message: "Sorry, something went wrong!" });
		}
	},

	chageUserInfo: async (req, res) => {
		try {
			const userData = {
				email: req.body.email,
				username: req.body.username,
				avatarImgUrl: req.body.avatarImgUrl,
			};
			await userService.updateUserInfo(userData);
			return res.status(200).json({ ok: true });
		} catch (e) {
			if (process.env.NODE_ENV !== "development") {
				console.log(e);
			}
			res
				.status(500)
				.json({ error: true, message: "Sorry, something went wrong!" });
		}
	},
};
