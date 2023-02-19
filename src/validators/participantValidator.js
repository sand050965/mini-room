const express = require("express");
const Joi = require("joi");

const roomIdSchema = Joi.object({
  roomId: Joi.string().required(),
});

const roomIdAndUserIdSchema = Joi.object({
  roomId: Joi.string().required(),
  participantId: Joi.string().required(),
});

const roomIdAndUserNameSchema = Joi.object({
  roomId: Joi.string().required(),
  participantName: Joi.string().required(),
});

const insertParticipantSchema = Joi.object({
  roomId: Joi.string().required(),
  participantId: Joi.string().required(),
  participantName: Joi.string().required(),
  avatarImgUrl: Joi.string().required(),
  isMuted: Joi.boolean().required(),
  isStoppedVideo: Joi.boolean().required(),
});

module.exports = {
  insertParticipantValidator: (req, res, next) => {
    const data = {
      roomId: req.body.roomId,
      participantId: req.body.participantId,
      participantName: req.body.participantName,
      avatarImgUrl: req.body.avatarImgUrl,
      isMuted: req.body.isMuted,
      isStoppedVideo: req.body.isStoppedVideo,
    };

    const { error, value } = insertParticipantSchema.validate(data, {
      abortEarly: false,
    });

    if (error) {
      console.log(error);
      return res.status(400).send(error.details[0].message);
    }

    next();
  },

  getParticipantValidator: (req, res, next) => {
    const data = {
      roomId: req.params.roomId,
      participantId: req.query.participantId,
    };

    const { error, value } = roomIdAndUserIdSchema.validate(data, {
      abortEarly: false,
    });

    if (error) {
      console.log(error);
      return res.status(400).send(error.details[0].message);
    }

    next();
  },

  getAllParticipantsValidator: (req, res, next) => {
    const data = { roomId: req.params.roomId };

    const { error, value } = roomIdSchema.validate(data, { abortEarly: false });

    if (error) {
      console.log(error);
      return res.status(400).send(error.details[0].message);
    }

    next();
  },

  getParticipantIdsByNameValidator: (req, res, next) => {
    const data = {
      roomId: req.query.roomId,
      participantName: req.query.participantName,
    };

    const { error, value } = roomIdAndUserNameSchema.validate(data, {
      abortEarly: false,
    });

    if (error) {
      console.log(error);
      return res.status(400).send(error.details[0].message);
    }

    next();
  },

  deleteAllParticipantsValidator: (req, res, next) => {
    const data = {
      roomId: req.body.roomId,
    };

    const { error, value } = roomIdSchema.validate(data, {
      abortEarly: false,
    });

    if (error) {
      console.log(error);
      return res.status(400).send(error.details[0].message);
    }

    next();
  },

  participantLeaveValidator: (req, res, next) => {
    const data = {
      roomId: req.body.roomId,
      participantId: req.body.participantId,
    };

    const { error, value } = roomIdAndUserIdSchema.validate(data, {
      abortEarly: false,
    });

    if (error) {
      console.log(error);
      return res.status(400).send(error.details[0].message);
    }

    next();
  },
};
