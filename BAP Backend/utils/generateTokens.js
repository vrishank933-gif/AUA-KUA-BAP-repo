const { name } = require('ejs');
const jwt=require('jsonwebtoken');

const generateToken=(user)=>{

return jwt.sign(
  {
    userid: user.userid,
    role: user.userrolecode,
    name: user.name_of_applicant,
    email: user.email
  },
  process.env.JWT_KEY,
  { expiresIn: '1h' }
);
};


module.exports.generateToken=generateToken

