const express = require("express");
const router = express.Router();
const {testregister, testlogin, logoutUser}=require("../controllers/authController");




router.get('/', function (req, res) {
  res.send("users router working");
});

router.get('/logout', logoutUser);

router.post('/register',testregister);

router.post('/login', testlogin);


module.exports = router;