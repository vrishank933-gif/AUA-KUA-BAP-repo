const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { generateToken } = require("../utils/generateTokens");
const pool = require("../db");
const prisma = require('../lib/prisma');



// const {}

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
      SELECT userid, name_of_applicant, email, password, userrolecode
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

  
