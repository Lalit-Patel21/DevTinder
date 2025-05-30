const jwt = require("jsonwebtoken");
const User = require("../models/user");
const userAuth = async (req, res, next) => {
  //read  the token from the req cookies
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("token is not valid");
    }

    // // validate the token
    const decodeObj = await jwt.verify(token, "DEVTinder@786");
    const { _id } = decodeObj;
    // find the user
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("user not found");
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(400).send("Error from middleware : " + err.message);
  }
};
module.exports = {
  userAuth,
};
