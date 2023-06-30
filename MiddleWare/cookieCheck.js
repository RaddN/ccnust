const jsonwebtoken = require("jsonwebtoken");
const CookieCheck = (req, res) => {
  const myCookie = req.cookie.token;
};
module.exports = CookieCheck;
