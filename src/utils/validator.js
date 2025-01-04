const validator = require("validator");

const signUpValidator = async(req) => {
  const { fName, email, password } = req.body;
  if (fName.trim() === "") {
    throw new Error("Name Must Contain Characters");
  } if (!validator.isEmail(email.trim())) {
    throw new Error("Email Id must be Valid!", email);
  }  if (!validator.isStrongPassword(password)) {
    throw new Error("Password Must be Strong!");
  }
  return true;
};


const ProfileEditValidator = async(req) => {
  const validateData = ["fName", "lName", "gender", "age", "skills"];
  const { fName, lName, gender, skills } = req.body;
  if (fName?.length < 3 || fName?.length > 15) {
    throw new Error(
      "Length of first name should be between 3 to 15 characters"
    );
  }
  if (lName?.length < 3 || lName?.length > 15) {
    throw new Error("Length of last name should be between 3 to 15 characters");
  }
  if (skills?.length > 10 || skills?.length < 2) {
    throw new Error("Skills must be more than 2 and less than 10");
  }
  const isdataValid =await Object.keys(req.body).every((data) =>
    data.includes(validateData)
  );
  return isdataValid;
};

module.exports = { signUpValidator, ProfileEditValidator };
