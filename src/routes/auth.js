
const express = require("express");
const authRouter = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const { userAuth } = require("../middlewares/auth");
const {signUpValidator} = require("../utils/validator");

//Signup Api
authRouter.post("/signup", async (req, res) => {
  try {
    await signUpValidator(req);
    const { fName, lName, email, gender, age, password, confirmPassword, skills } = req.body;

    if(password!==confirmPassword)
      {
        return res.status(400).send({message:"Password and Confirm Password must be same"})
      }
      const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    const user = new User({
      fName,
      lName,
      email,
      gender,
      age,
      password: hashPassword,
      skills,
    });
    // console.log("User->",user)
    const newUser = await user.save();
    // console.log(newUser);
    res.send("User Added Successfully");
  } catch (err) {
    res.status(400).send("Something Went Wrong!");
  }
});

//login Api
authRouter.post("/login", async (req, res) => {
  const email = req?.body?.email;
  const password = req.body.password;
  const foundUser = await User.find({ email: email });
  if (foundUser.length !== 0) {
    try {
      const comparedPassword = await bcrypt.compare(
        password,
        foundUser[0].password
      );

      if (comparedPassword) {
        const token = await foundUser[0].getJWT();
        res.cookie("Token", token);
        res.json({message:"User Login Successfull",
          data:foundUser[0]
        });
      } else {
        res.status(401).send("Wrong Password!!");
      }
    } catch (err) {
      res.status(400).send("Something Went Wrong!");
    }
  } else {
    res.status(404).send("User Not Found!");
  }
});

//Logout API
authRouter.post("/logout", userAuth, async (req, res) => {
  await res.cookie("Token", null, {
    expires: new Date(Date.now()),
  });
  res.json({message:"User LoggedOut Successfully!"});
});

module.exports = authRouter;
