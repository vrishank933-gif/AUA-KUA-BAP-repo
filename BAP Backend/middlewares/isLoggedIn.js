const jwt = require("jsonwebtoken");
const userModel = require("../models/user-model");

module.exports = async function (req, res, next) {
  if (!req.cookies.token) {
    // req.flash("error", "you need to login first(isLoggedIn)");
    // return res.redirect("/login");
    // return res.send("you need to login first(isLoggedIn)");
    return res.status(401).json({ error: "you need to login first" });
  }

  try {
    let decoded = jwt.verify(req.cookies.token, process.env.JWT_KEY);
    req.user = decoded;
    next();
  } 
  catch (err) {
    return res.status(500).json({ error: "Problem at isLoggedIn." });
    // res.redirect("/");
  }
};
