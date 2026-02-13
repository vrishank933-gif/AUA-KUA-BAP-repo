const mongoose = require("mongoose");

const applicationsSchema = mongoose.Schema({
    organizationName:{
        type:String,
        minlength:1,
    maxlength:100
    },
    email: {
      type: String,
      required:true,
      unique:true,
      lowercase:true,
      trim:true,
      index:true
    },
    
    status: {
        type: String,
        enum: [
            "submitted",
            "under_scrutiny",
            "awaiting_in_principle_approval",
            "in_principle_approved",
            "agreement_execution",
            "audits_testing",
            "ready_for_production",
            "sent_back",
            "rejected"
        ],
        default: "submitted"
    }
}, { timestamps: true });



module.exports = mongoose.model("applications", applicationsSchema);
