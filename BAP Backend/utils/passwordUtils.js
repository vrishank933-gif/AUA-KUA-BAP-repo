const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken')
const userModel=require('../models/user-model');
const {generateToken}=require('../utils/generateTokens');

const generatePassword=(password)=>{
   return bcrypt.genSalt(10,function(err,salt){
                  bcrypt.hash(password,salt,async function(err,hash){
                    if(err) return res.send(err.message);
                    else {
                      let user= await userModel.create({
                      fullname,
                      email,
                      password:hash
                });
                    let token=generateToken(user);
                    res.cookie("token",token);
                    res.send("user created successfully");
                    }
                  })
                })

}

module.exports.generatePassword=generatePassword
