const express = require("express");
const Joi = require("joi");

const roomIdSchema = Joi.object({
  roomId: Joi.string().required(),
});

module.exports = {
  joinRoomValidator: (req, res, next) => {
    const data = { roomId: req.query.roomId };

    const { error, value } = roomIdSchema.validate(data, { abortEarly: false });

    if (error) {
      console.log(error);
      return res.status(400).send(error.details[0].message);
    }

    next();
  },

  closeRoomValidator: (req, res, next) => {
    const data = { roomId: req.body.roomId };

    const { error, value } = roomIdSchema.validate(data, { abortEarly: false });

    if (error) {
      console.log(error);
      return res.status(400).send(error.details[0].message);
    }

    next();
  },
};
