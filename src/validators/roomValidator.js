const express = require("express");
const Joi = require("joi");

module.exports = {
  roomIdAndUserIdValidator: (req, res, next) => {
    const data = { roomId: req.params.roomId, userId: req.params.userId };
    const schema = Joi.object({
      roomId: Joi.string().required(),
      userId: Joi.string().required(),
    });

    const { error, value } = schema.validate(data, { abortEarly: false });

    if (error) {
      console.log(error);
      return res.status(400).send(error.details[0].message);
    }

    next();
  },

  roomIdValidator: (req, res, next) => {
    const data = { roomId: req.params.roomId };

    const schema = Joi.object({
      roomId: Joi.string().required(),
    });

    const { error, value } = schema.validate(data, { abortEarly: false });

    if (error) {
      console.log(error);
      return res.status(400).send(error.details[0].message);
    }

    next();
  },
};
