const express = require("express");
const { userAuth } = require("../middlewares/auth");
const User = require("../models/User");
const { ProfileEditValidator } = require("../utils/validator");
const validator = require("validator");
const bcrypt = require("bcrypt");
const profileRouter = express.Router();

//View User Profile API
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const userData = req.userData;
    if (!userData) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ data: userData });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// User Profile Edit API
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  const { fName, lName, email, gender, age, skills } = req.body;
  try {
    if (!ProfileEditValidator(req)) {
      throw new Error("Wrong Edit Data");
    }
    const { _id } = req.userData;
    const updatedUserData = await User.findByIdAndUpdate(
      _id,
      {
        fName,
        lName,
        email,
        gender,
        age,
        skills,
      },
      { new: true }
    );
    console.log(updatedUserData);
    res.json({ message: "User Updated Successfully!!", data: updatedUserData });
  } catch (error) {
    res.send(error.message);
  }
});

// Forgot Password API
profileRouter.patch("/profile/forgotPassword", userAuth, async (req, res) => {
    try {
      const { password: updatedPassword } = req.body;
      const { _id, password } = req.userData;
  
      const passwordCompare = await bcrypt.compare(updatedPassword, password);
  
      if (passwordCompare) {
        throw new Error("Old and New Password Can't be Same");
      }
      if(!validator.isStrongPassword(updatedPassword))
        {
            throw new Error("Password Must be Strong!");
        }
  
      const hashedPassword = await bcrypt.hash(updatedPassword, 10);
      await User.findByIdAndUpdate(_id, { password: hashedPassword });
      
      res.json({ message: "Password Updated Successfully!"});
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  

module.exports = profileRouter;
