const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  firstname:{
    type:String,
    required:true,
    trim:true,
    minlength:2,
    maxlength:100
  },
  lastname:{
    type:String,
    required:true,
    trim:true,
    minlength:2,
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
    password: {
      type:String,
      required:true,
      minlength:8,
    },

    role: {
      type:String,
      enum:["user", "admin","onbofficer","financeteam","auditor"],
      default:"user"
    },
   isVerified:{
    type:Boolean,
    default:false
   },
   isDeleted:{
        type:Boolean,
        default:false
      },
      otp:String,
      otpExpiry:Date,
      deleteAt:Date,

},{timestamps:true});
userSchema.index({deleteAt:1},{expireAfterSeconds:0});
// userSchema.index({ email: 1 }, { unique: true });

module.exports = mongoose.model("user", userSchema);
