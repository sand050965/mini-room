/** @format */

const express = require("express");
const router = express.Router();
const memberController = require("../controllers/memberController");

router.get("/", memberController.getToMember);

module.exports = router;
