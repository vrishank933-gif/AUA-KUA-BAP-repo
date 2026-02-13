const express = require("express");
const router = express.Router();
const {registerUser, verifyOtp, loginUser, logoutUser, forgotPassword, verifyOtpPass, deleteUser, testregister, testlogin}=require("../controllers/authController");
// const isLoggedIn=require("../middlewares/isLoggedIn");
// const prisma = require("../lib/prisma");



router.get('/', function (req, res) {
  res.send("users router working");
});

router.post('/verifyOtp', verifyOtp);


router.post('/forgotPassword',forgotPassword);

router.post('/verifyOtpPass',verifyOtpPass);

router.get('/logout',logoutUser);

router.post('/deleteUser',deleteUser);

router.post('/register',testregister);

router.post('/login', testlogin);


module.exports = router;