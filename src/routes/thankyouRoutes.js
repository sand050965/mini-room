const express = require("express");
const thankyouController = require("../controllers/thankyouController");
const router = express.Router();

// thankyou 
router.get("/", thankyouController.getToThankyou);

module.exports = router;
