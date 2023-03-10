/** @format */

const express = require("express");
const canvasController = require("../controllers/canvasController");
const router = express.Router();

router.get("/", canvasController.getToCanvas);

module.exports = router;
