const session = require("express-session");
const express = require("express");
const Joi = require("joi");

const sendMalSchema = Joi.object({
  email: Joi.string().required().email(),
});

module.exports = {
  sendMailValidator: (req, res, next) => {
    for (const email of req.body.email) {
      const { error, value } = sendMalSchema.validate(email, {
        abortEarly: false,
      });
    }

    if (error) {
      console.log(error);
      return res.status(400).send(error.details[0].message);
    }

    next();
  },
};
