const express = require("express");
const router = express.Router();
const {pendingForScrutiny, pendingForInPrincipalApproval, applicationDetails}=require("../controllers/onbController");


router.get("/pendingForScrutiny", pendingForScrutiny);

router.get("/pendingForInPrincipalApproval", pendingForInPrincipalApproval);

router.get("/applicationDetails/:id",applicationDetails)

module.exports = router;

