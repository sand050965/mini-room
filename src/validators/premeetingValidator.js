const express = require("express");
const Joi = require("joi");

module.exports = {
  participantValidator: (req, res, next) => {
    const data = {
      roomId: req.body.roomId,
      userId: req.body.userId,
      userName: req.body.userName,
      isMuted: req.body.isMuted,
      isStoppedVideo: req.body.isStoppedVideo,
      isReadyState: req.body.isReadyState,
    };

    const schema = Joi.object({
      roomId: Joi.string().required(),
      userId: Joi.string().required(),
      userName: Joi.string().required(),
      isMuted: Joi.boolean().required(),
      isStoppedVideo: Joi.boolean().required(),
      isReadyState: Joi.boolean().required(),
    });

    const { error, value } = schema.validate(data, { abortEarly: false });

    if (error) {
      console.log(error);
      return res.status(400).send(error.details[0].message);
    }

    next();
  },
};
