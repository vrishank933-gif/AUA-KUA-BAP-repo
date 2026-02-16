const express = require('express');
const router = express.Router();
const {getApplication} = require('../controllers/applicationController');
const isLoggedIn = require('../middlewares/isLoggedIn');

router.get('/getApplication',isLoggedIn, getApplication);

module.exports = router
