const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { generateToken } = require("../utils/generateTokens");
const pool = require("../db");
const prisma = require('../lib/prisma');  

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


module.exports.testregister = async function (req, res) {
try {
  let {email, name_of_applicant, password, userrolecode, phone_number} = req.body;

  if (!email || !name_of_applicant || !password || !userrolecode || !phone_number) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  email = email.trim().toLowerCase();
  userrolecode = Number(userrolecode);
  if (!Number.isInteger(userrolecode)) {
    return res.status(400).json({
      message: "Invalid userrolecode",
    });
  }

  const existingUser = await prisma.master_users.findFirst({
    where: {
      email: { equals: email, mode: "insensitive" },
    },
    select: { userid: true },
  });

  if (existingUser) {
    req.flash("error", "User already exists");
    return res.status(409).json({
      message: "User already exists",
    });
  }

  const hash = await bcrypt.hash(password, 10);

  const user = await prisma.master_users.create({data: {
      name_of_applicant,
      userrolecode,
      email,
      password: hash,
      phone_number,
    },
    select: { userid: true },
  });

  return res.status(200).json({ message: "successful" });

} catch (err) {
  console.error("REGISTER ERROR:", err);
  return res.status(500).json({
    message: "Internal server error",
  });
}
};

module.exports.testlogin = async function (req, res) {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    email = email.trim().toLowerCase();

    const user = await prisma.master_users.findFirst({where: {
        email: { equals: email, mode: "insensitive" },
      },
      select: {
        userid: true,
        name_of_applicant: true,
        email: true,
        password: true,
        userrolecode: true,
      },
    });

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

    return res.status(200).json({message:"Login Successful",token,user: {...user, password: undefined}});

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

  
