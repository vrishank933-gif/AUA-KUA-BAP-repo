const { application } = require("express");
const applications = require("../models/applications-model");


module.exports.pendingForScrutiny=async function (req, res){
    let pendingForScrutiny = await applications
  .find({ status: "pending_for_scrutiny" });
res.render("onboarding/pendingforscrutiny", { applications: pendingForScrutiny });
}


module.exports.pendingForInPrincipalApproval=async function (req, res){
    let pendingForInPrincipalApproval = await applications
  .find({ status: "pending_for_in_principal_approval" });
res.render("onboarding/pendingforscrutiny", { applications: pendingForInPrincipalApproval });
}

module.exports.applicationDetails=async function (req, res){
    let applicationId = req.params.id;
    let application = await applications.findById(applicationId);
    // res.render("onboarding/applicationDetails", { application: application });
    res.json(application);

}

module.exports.approveScrutiny=async function (req, res){
    let applicationId = req.params.id;
    await applications.findByIdAndUpdate(applicationId, { status: "pending_for_in_principal_approval" });
    res.json({ message: "Application approved for in-principal approval" });
}

module.exports.rejectScrutiny=async function (req, res){
  let applicatonId=req.params.id;
  await applications.findByIdAndUpdate(applicatonId,{status:"rejected_at_scrutiny"});
  res.json({message:"Application rejected at scrutiny"});
}

module.exports.approveInPrincipal=async function (req, res){
  let applicationId = req.params.id;
  await applications.findByIdAndUpdate(applicationId, {status: "licence_free_verification_pending"});
  res.json({ message: "Application approved" });
}