const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = {
  verifyAccessToken: (req, res, next) => {
    try {
      const { access_token } = req.cookies;
      if (access_token === null) {
        return res
          .status(401)
          .json({ error: true, message: "No access token found!" });
      }
      const user = jwt.verify(
        access_token,
        process.env.JWT_ACCESS_TOKEN_SECRET
      );
      req.user = user;
      next();
    } catch (err) {
      return res
        .status(403)
        .json({ error: true, message: "Invalid access token!" });
    }
  },
};
