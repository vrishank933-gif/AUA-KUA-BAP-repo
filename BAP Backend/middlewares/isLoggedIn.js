const jwt = require("jsonwebtoken");

module.exports = async function (req, res, next) {
  if (!req.cookies.token) {
    return res.status(401).json({ error: "you need to login first" });
  }

  try {
    let decoded = jwt.verify(req.cookies.token, process.env.JWT_KEY);
    req.user = decoded;
    next();
  } 
  catch (err) {
    return res.status(500).json({ error: "Problem at isLoggedIn." });
  }
};
