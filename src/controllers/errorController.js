/** @format */

const express = require("express");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const userService = require("../services/userService.js");

module.exports = {
	getToError: async (req, res) => {
		return res.render("error");
	},
};
