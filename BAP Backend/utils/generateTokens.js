const jwt=require('jsonwebtoken');

const generateToken=(user)=>{

return jwt.sign(
  {
    userid: user.userid,
    role: user.userrolecode,
    email: user.email
  },
  process.env.JWT_KEY,
  { expiresIn: '1h' }
);
};

// console.log("JWT KEY:", process.env.JWT_KEY);


module.exports.generateToken=generateToken

