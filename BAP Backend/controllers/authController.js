const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user-model");
const { generateToken } = require("../utils/generateTokens");
const nodemailer = require("nodemailer");
const { generateOtp } = require("../utils/generateOtp");
// const prisma = require("../lib/prisma");

const pool = require("../db");


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL,
    pass: process.env.PASS
  }
});

// module.exports.registerUser=async function (req, res) {
//   try {
//     let { firstname, lastname, email, password, role} = req.body;

//     if (!firstname || !lastname || !email || !password) {
//       req.flash("error", "All fields are required");
//       return res.redirect("/register");
//     }

//     email = email.toLowerCase().trim();


// // const exist = await prisma.masterUser.findFirst({where: { email }});
// const exist=await userModel.findOne({ email });

// // if(!exist){
// //       req.flash("success", "OTP sent to your email");

// // }

//     if (exist && !exist.isVerified) {
//       const otp = generateOtp();

//       exist.otp = otp;
//       exist.otpExpiry = Date.now() + 10 * 60 * 1000;
//       exist.deleteAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
//       await exist.save();

//       await transporter.sendMail({
//         to: email,
//         subject: "Email verification",
//         text: `Your OTP is ${otp}`
//       });

//       req.flash("success", "OTP re-sent to your email");
//       return res.redirect("/verify");
//     }

//     if (exist && exist.isVerified) {
//       req.flash("error", "Email already registered");
//       return res.redirect("/login");
//     }

//     if (
//       !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/
//         .test(password)
//     ) {
//       req.flash("error", "Password does not meet requirements");
//       return res.redirect("/register");
//     }

//     const salt = await bcrypt.genSalt(10);
//     const hash = await bcrypt.hash(password, salt);
//     const otp = generateOtp();

//     await userModel.create({
//       firstname,
//       lastname,
//       email,
//       password: hash,
//       otp,
//       otpExpiry: Date.now() + 10 * 60 * 1000,
//       deleteAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
//       role
//     });

//     await transporter.sendMail({
//       to: email,
//       subject: "Email verification",
//       text: `Your OTP is ${otp}`
//     });

//     req.flash("success", "OTP sent to your email");
//     return res.redirect("/verify");
//         // return res.json({message: "OTP sent to your email"});


//   } catch (err) {
//     req.flash("error", "Something went wrong during registration");
//     return res.redirect("/register");
//   }
// };

module.exports.verifyOtp=async function (req, res){
  try {
    const { email, otp } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      req.flash("error", "User not found");
      return res.redirect("/verify");
    }

    if (user.otp !== otp || user.otpExpiry < Date.now()) {
      req.flash("error", "Invalid or expired OTP");
      return res.redirect("/verify");
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;
    user.deleteAt = null;
    await user.save();

    req.flash("success", "Email verified successfully. Please login.");
    return res.redirect("/login");

  } catch (err) {
    req.flash("error", "OTP verification failed");
    return res.redirect("/verify");
  }
};

// module.exports.loginUser=async function (req, res){
//   try {
//     let { email, password } = req.body;
//     email = email.toLowerCase().trim();

//     let user = await userModel.findOne({ email });

//     if (!user){
//       req.flash("error", "Invalid email or password");
//       return res.redirect("/login");
//     }

//     if(user.isDeleted){
//       req.flash("error", "User not found");
//       return res.redirect("/login");
//     }

//     if (!user.isVerified) {
//       req.flash("error", "Please verify your email first");
//       return res.redirect("/login");
//     }

//     let match = await bcrypt.compare(password, user.password);
//     if (!match) {
//       req.flash("error", "Invalid email or password");
//       return res.redirect("/login");
//     }

//     await user.save();

//     let token = generateToken(user);
//     res.cookie("token", token);

//     req.flash("success", "Login successful");
//     return res.redirect("/home");

//   } catch (err) {
//     req.flash("error", "Login failed");
//     return res.redirect("/login");
//   }
// };

module.exports.forgotPassword=async function (req, res){
  try {
    let { email } = req.body;
    email = email.toLowerCase().trim();

    const exist = await userModel.findOne({ email });

    if (!exist) {
      req.flash("error", "User does not exist");
      return res.redirect("/forgot-password");
    }

     if(exist.isDeleted){
      req.flash("error", "User not found");
      return res.redirect("/login");
    }

    if (!exist.isVerified) {
      req.flash("error", "Please verify your email first");
      return res.redirect("/login");
    }

    const otp = generateOtp();
    exist.otp = otp;
    exist.otpExpiry = Date.now() + 10 * 60 * 1000;
    await exist.save();

    await transporter.sendMail({
      to: email,
      subject: "Email verification",
      text: `Your OTP is ${otp}`
    });

    req.flash("success", "Password reset OTP sent to your email");
    return res.redirect("/reset-password");

  } catch (err) {
    req.flash("error", "Failed to send reset OTP");
    return res.redirect("/forgot-password");
  }
};

module.exports.verifyOtpPass=async function (req, res){
  try {
    let { email, otp, password, confirmPassword } = req.body;

    if (!email || !otp || !confirmPassword || !password) {
      req.flash("error", "All fields are required");
      return res.redirect("/reset-password");
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      req.flash("error", "User not found");
      return res.redirect("/reset-password");
    }

    if (user.otp !== otp || user.otpExpiry < Date.now()) {
      req.flash("error", "Invalid or expired OTP");
      return res.redirect("/reset-password");
    }

    if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/
        .test(password)
    ) {
      req.flash("error", "Password does not meet requirements");
      return res.redirect("/reset-password");
    }

    if (password !== confirmPassword) {
      req.flash("error", "Passwords do not match");
      return res.redirect("/reset-password");
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    user.password = hash;
    user.otp = null;
    user.otpExpiry = null;
    user.deleteAt = null;
    await user.save();

    req.flash("success", "Password reset successful. Please login.");
    return res.redirect("/login");

  } catch (err) {
    req.flash("error", "Password reset failed");
    return res.redirect("/reset-password");
  }
};

module.exports.logoutUser=async function (req, res){
  try {
    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    req.user = decoded;

    res.clearCookie("token");
    req.flash("success", "Logged out successfully");
    return res.json({message:"Logged out successfully"});

  } catch (err) {
    // req.flash("error", "Please login first");
    return res.json({message:"Please login first"});
  }
};

module.exports.deleteUser=async function(req,res){
  try {
    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    // req.user = decoded;

    await userModel.findOneAndUpdate({email:decoded.email},{
      isDeleted:true
    });


    res.clearCookie("token");
    req.flash("success", "User Deleted Successfully");
    return res.redirect("/login");
  } 
  catch (err) {
    req.flash("error", "Error deleting account");
    return res.redirect("/login");
  }
}


module.exports.testregister=async function(req,res){

try {
    let { email, name_of_applicant, password, userrolecode } = req.body;

    if (!email || !name_of_applicant || !password || !userrolecode) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    email = email.trim().toLowerCase();

    const checkQuery = `
      SELECT 1
      FROM master_users
      WHERE LOWER(email) = LOWER($1)
      LIMIT 1;
    `;

    const {rows: existingRows}=await pool.query(checkQuery, [email]);

    if (existingRows.length > 0){
      req.flash("error", "User already exists");
      return res.status(409).json({
        message: "User already exists",
      });
    }

    const hash = await bcrypt.hash(password, 10);

    const insertQuery = `
      INSERT INTO master_users
        (name_of_applicant, userrolecode, email, password)
      VALUES
        ($1, $2, $3, $4)
      RETURNING userid;
    `;

    const values = [
      name_of_applicant,
      userrolecode,
      email,
      hash,
    ];

    const {rows} = await pool.query(insertQuery, values);
    return res.status(200).json({message:"successful"});

  } catch (err) {
    console.error("REGISTER ERROR:", err);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}


module.exports.testlogin = async function (req, res) {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    email=email.trim().toLowerCase();

    const query= `
      SELECT userid, email, password, userrolecode
      FROM master_users
      WHERE LOWER(email) = LOWER($1)
      LIMIT 1;
    `;

    const {rows} = await pool.query(query, [email]);
    const user = rows[0];

    if (!user){

      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match){

      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    let token = generateToken(user);
    
res.cookie("token", token, {
  httpOnly: true,
  secure: true,
  sameSite: "None",
  maxAge: 3600000,
});

    return res.status(200).json({token,user: {...user, password: undefined}});

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

  
