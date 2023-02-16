const session = require("express-session");
const express = require("express");
const Joi = require("joi");

const getUserSchema = Joi.object({
  email: Joi.string().required().email(),
});

const signupSchema = Joi.object({
  email: Joi.string().required().email(),
  password: Joi.string().min(6).max(30).required(),
  username: Joi.string().min(1).max(20).required(),
  avatarImgUrl: Joi.string().required(),
});

const loginSchema = Joi.object({
  email: Joi.string().required().email(),
  password: Joi.string().min(6).max(30).required(),
});

const changeUserAvatarSchema = Joi.object({
  email: Joi.string().required().email(),
  avatarImgUrl: Joi.string().required(),
});

const changeUsernameSchema = Joi.object({
  email: Joi.string().required().email(),
  username: Joi.string().min(1).max(20).required(),
});

module.exports = {
  getUserValidator: (req, res, next) => {
    const data = { email: req.session.email };

    const { error, value } = getUserSchema.validate(data, {
      abortEarly: false,
    });

    if (error) {
      console.log(error);
      return res.status(400).send(error.details[0].message);
    }

    next();
  },

  signupValidator: (req, res, next) => {
    const data = {
      email: req.body.email,
      password: req.body.password,
      username: req.body.username,
      avatarImgUrl: req.body.avatarImgUrl,
    };

    const { error, value } = signupSchema.validate(data, { abortEarly: false });

    if (error) {
      console.log(error);
      return res.status(400).send(error.details[0].message);
    }

    next();
  },

  loginValidator: (req, res, next) => {
    const data = { email: req.body.email, password: req.body.password };

    const { error, value } = loginSchema.validate(data, { abortEarly: false });

    if (error) {
      console.log(error);
      return res.status(400).send(error.details[0].message);
    }

    next();
  },

  changeUserAvatarValidator: (req, res, next) => {
    const data = {
      email: req.body.email,
      avatarImgUrl: req.body.avatarImgUrl,
    };

    const { error, value } = changeUserAvatarSchema.validate(data, {
      abortEarly: false,
    });

    if (error) {
      console.log(error);
      return res.status(400).send(error.details[0].message);
    }

    next();
  },

  changeUsernameValidator: (req, res, next) => {
    const data = {
      email: req.body.email,
      username: req.body.username,
    };

    const { error, value } = changeUsernameSchema.validate(data, {
      abortEarly: false,
    });

    if (error) {
      console.log(error);
      return res.status(400).send(error.details[0].message);
    }

    next();
  },
};
