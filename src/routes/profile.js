const express = require("express");
const profileRouter = express.Router();
// const User = require("../models/user");
const {
  validateEditProfileData,
  validateEditPasswordData,
} = require("../utils/validation");
const bcrypt = require("bcrypt");
const { userAuth } = require("../middlewares/auth");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    // res.send(user);
    res.json({
      message: `${user.firstName}, your profile fetched successfully`,
      data: user,
    });
  } catch (err) {
    res.status(400).send("Error : " + err.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("InValid Edit Request");
    }
    const loggedInUser = req.user;

    // loggedInUser.firstName = req.body.firstName;

    Object.keys(req.body).forEach((keys) => {
      loggedInUser[keys] = req.body[keys];
    });
    await loggedInUser.save();

    // const user = await User.findByIdAndUpdate({ _id: userId }, data, {
    //       returnDocument: "after",
    //       runValidators: true,
    //     });
    //     res.send("user updated successfully");

    res.json({
      message: `${loggedInUser.firstName}, your profile updated successfully`,
      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).send("Error : " + err.message);
  }
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const loggedInUser = req.user;

    const isPasswordValid = await loggedInUser.validatePassword(
      currentPassword
    );

    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }

    if (!validateEditPasswordData(req)) {
      throw new Error("InValid update password Request");
    }
    const passwordHash = await bcrypt.hash(newPassword, 10);

    loggedInUser.password = passwordHash;

    await loggedInUser.save();

    res.json({
      message: `${loggedInUser.firstName}, your password updated successfully`,
      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).send("Error : " + err.message);
  }
});

module.exports = profileRouter;
