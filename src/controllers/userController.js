require("dotenv").config();
const express = require("express");
const userService = require("../services/userService");

module.exports = {
  login: async (req, res) => {
    try {
      const userData = {};
      await userService.login(userData);
      res.status(200).json({ ok: true });
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
