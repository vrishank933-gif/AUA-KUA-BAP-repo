const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const {submitApplication} = require('../controllers/applicationController');
const isLoggedIn = require('../middlewares/isLoggedIn');

const uploadFields = upload.fields([
  { name: 'reg_incorporation_documentpath', maxCount: 1 },
  { name: 'license_no_documentpath', maxCount: 1 },
  { name: 'gstn_reg_no_documentpath', maxCount: 1 },
  { name: 'tax_tan_documentpath', maxCount: 1 },
  { name: 'board_resolution_documentpath', maxCount: 1 },
  { name: 'provision_aadhar_documentpath', maxCount: 1 }, 
]);

router.post('/submitApplication',isLoggedIn, uploadFields, submitApplication);

module.exports = router;