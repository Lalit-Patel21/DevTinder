const validator = require("validator");
const validateSignUpData = (req) => {
  const {
    firstName = "",
    lastName = "",
    emailId = "",
    password = "",
    photoUrl = "",
    about = "",
    gender = "",
    age = 0,
    skills = [],
  } = req.body;

  // const { firstName, lastName, emailId, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("name is not valid");
  } else if (firstName.length < 4 || firstName.length > 50) {
    throw new Error("firstname should be 4-50 characters");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Email is not valid");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("please enter a Strong password");
  } else if (!validator.isURL(photoUrl)) {
    throw new Error("photoUrl is invalid");
  } else if (about.length > 50) {
    throw new Error("about can not be more than 30 words");
  } else if (skills.length > 50) {
    throw new Error("skills can not be more than 50");
  } else if (age <= 0 || age > 100) {
    throw new Error("Invalid age");
  } else if (!["male", "female", "others"].includes(gender)) {
    throw new Error("gender data isnot valid");
  }
};

const validateEditProfileData = (req) => {
  const allowedEditProfileFields = [
    "firstName",
    "lastName",
    "emailId",
    "photoUrl",
    "about",
    "gender",
    "age",
    "skills",
  ];

  // Ensure only provided fields are validated
  Object.keys(req.body).forEach((key) => {
    if (!allowedEditProfileFields.includes(key)) {
      throw new Error(`${key} is not a valid edit field`);
    }

    const value = req.body[key];

    switch (key) {
      case "firstName":
        if (
          typeof value !== "string" ||
          value.length < 4 ||
          value.length > 50
        ) {
          throw new Error("Firstname should be 4-50 characters");
        }
        break;

      case "lastName":
        if (
          typeof value !== "string" ||
          value.length < 2 ||
          value.length > 50
        ) {
          throw new Error("Lastname should be 2-50 characters");
        }
        break;

      case "emailId":
        if (!validator.isEmail(value)) {
          throw new Error("Email is not valid");
        }
        break;

      case "photoUrl":
        if (!validator.isURL(value)) {
          throw new Error("photoUrl is invalid");
        }
        break;

      case "about":
        if (typeof value !== "string" || value.length > 50) {
          throw new Error("About cannot be more than 30 characters");
        }
        break;

      case "gender":
        if (!["male", "female", "other"].includes(value)) {
          throw new Error("Invalid gender value");
        }
        break;

      case "age":
        if (typeof value !== "number" || value <= 0 || value > 100) {
          throw new Error("Invalid age");
        }
        break;

      case "skills":
        if (!Array.isArray(value) || value.length > 50) {
          throw new Error(
            "Skills must be an array and cannot have more than 50 items"
          );
        }
        break;
    }
  });

  return true;
};

const validateEditPasswordData = async (req) => {
  const { currentPassword, newPassword } = req.body;

  if (currentPassword === newPassword) {
    throw new Error("Invalid password");
  } else if (!validator.isStrongPassword(newPassword)) {
    throw new Error("please enter a Strong password");
  }
  const allowedEditPasswordFields = ["currentPassword", "newPassword"];
  const isEditPasswordAllowed = Object.keys(req.body).every((fields) =>
    allowedEditPasswordFields.includes(fields)
  );

  return isEditPasswordAllowed;
};

module.exports = {
  validateSignUpData,
  validateEditProfileData,
  validateEditPasswordData,
};

// const validateEditProfileData = (req) => {
//   const {
//     firstName = "",
//     lastName = "",
//     emailId = "",
//     photoUrl = "",
//     about = "",
//     gender = "",
//     age = 0,
//     skills = [],
//   } = req.body;

//   const allowedEditProfileFields = [
//     "firstName",
//     "lastName",
//     "emailId",
//     "photoUrl",
//     "about",
//     "gender",
//     "age",
//     "skills",
//   ];

//   const isEditProfileAllowed = Object.keys(req.body).every((field) => {
//     return allowedEditProfileFields.includes(field);
//   });
//   return isEditProfileAllowed;
// };
