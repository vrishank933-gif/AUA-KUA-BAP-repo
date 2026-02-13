const express = require("express");
const router = express.Router();
const isLoggedIn = require("../middlewares/isLoggedIn");

router.get("/", (req, res) => {
  res.render("index");
});

router.get("/register", (req, res) => {
  res.render("auth/register");
});

router.get("/login", (req, res) => {
  res.render("auth/login");
});

router.get("/verify", (req, res) => {
  res.render("auth/verify-otp");
});

router.get("/forgot-password", (req, res) => {
  res.render("auth/forgot-password");
});

router.get("/reset-password", (req, res) => {
  res.render("auth/reset-password");
});

router.get("/home", isLoggedIn, (req, res) => {
  res.render("home", { user: req.user });
});

router.get("/applicationform", isLoggedIn, (req, res) => {
  res.render("applicationform", { user: req.user });
 });

module.exports = router;
