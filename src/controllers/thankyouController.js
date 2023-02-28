const express = require("express");

// thankyou page
module.exports = {
  getToThankyou: async (req, res) => {
    res.render("thankyou");
  },
};
