const User = require('../models/user');
const jwt = require('jsonwebtoken');

const maxAge = 3*24*60*60*1000;
let createToken = (id) =>{
    return(jwt.sign({id:id}, process.env.JWT_SECRET_KEY, {
        expiresIn: maxAge
    }));
};


module.exports.login = async (req, res) => {
  let {email, password} = req.body;
    
  try {
     let user =  await User.login(email,password);
     
     if(!user){
         res.status(401).json({message: "error user is missing: email = "+email+" password= "+password+"   user= "+user});
     }
     let token = createToken(user._id);
     res.cookie('jwt', token, {httpOnly:true, maxAge});
     user = {...user._doc, token:token};  
     res.status(200).json(user);
  } catch (err){
      console.warn("err generating jwt "+err.name,err.message);
      res.status(401).json({ message: err.message });
  }
}