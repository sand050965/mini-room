/** @format */

const session = require("express-session");
const express = require("express");
const Joi = require("joi");

const nameAndEmailSchema = Joi.object({
	senderName: Joi.string().required(),
	recipientEmailArray: Joi.array()
		.items(Joi.string().required().email())
		.required(),
	roomId: Joi.string().required(),
});

module.exports = {
	sendEmailValidator: (req, res, next) => {
		const data = {
			senderName: req.body.senderName,
			recipientEmailArray: req.body.recipientEmailArray,
			roomId: req.body.roomId,
		};
		const { error, value } = nameAndEmailSchema.validate(data, {
			abortEarly: false,
		});

		if (error) {
			console.log(error);
			return res.status(400).send(error.details[0].message);
		}

		next();
	},
};
