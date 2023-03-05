const express = require("express");
const thankyouController = require("../controllers/thankyouController");
const router = express.Router();

router.get("/", thankyouController.getToThankyou);

module.exports = router;
