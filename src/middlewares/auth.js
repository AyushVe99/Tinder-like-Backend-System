const jwt = require("jsonwebtoken");
const User = require("../models/User");
const userAuth = async (req, res, next) => {
  try {
    const { cookies } = req;
   
    const {Token} = cookies;
    
    if (!Token) {
      return res.status(401).send("Token Not Found!")
    }
    console.log("JWT_SECRET:", process.env.JWT_SECRET)
    const decodedMessage = await jwt.verify(Token, process.env.JWT_SECRET);
   
    const { _id } = decodedMessage;
    if (!_id) {
      throw new Error("User Not Found");
    }
    const userData = await User.findById(_id);
    
    req.userData = userData;
    next();
  } catch (error) {
    res.status(400).send(error.message);
  }
};

module.exports = { userAuth };
