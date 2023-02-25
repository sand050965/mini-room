/** @format */

const express = require("express");
require("dotenv").config();
const shortid = require("shortid");
const Joi = require("joi");
const JoiUtil = require("../utils/joiUtil");

module.exports = {
	roomIdValidator: (req, res, next) => {
		const data = { roomId: req.params.roomId };

		if (!shortid.isValid(req.params.roomId)) {
			return res.render(error);
		}

		const { error, value } = JoiUtil.roomIdSchema.validate(data, {
			abortEarly: false,
		});

		if (error) {
			if (process.env.NODE_ENV !== "development") {
				console.log(error);
			}

			return res.render(error);
		}

		next();
	},
};
