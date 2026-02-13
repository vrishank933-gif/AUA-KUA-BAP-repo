const express = require("express");
const router = express.Router();
const {approveScrutiny,rejectScrutiny, approveInPrincipal}=require("../controllers/onbController");

router.post("/approveScrutiny/:id", approveScrutiny);

router.post("/rejectScrutiny/:id", rejectScrutiny);

router.post("/approveInPrincipal/:id", approveInPrincipal);

module.exports = router;