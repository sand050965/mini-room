const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/", userController.getIntoUser);

module.exports = router;
