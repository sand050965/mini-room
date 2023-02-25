/** @format */

const express = require("express");

module.exports = {
	getToMember: async (req, res) => {
		return res.render("member");
	},
};
