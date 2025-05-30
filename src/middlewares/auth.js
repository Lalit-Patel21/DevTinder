const jwt = require("jsonwebtoken");
const User = require("../models/user");
const userAuth = async (req, res, next) => {
  //read  the token from the req cookies
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("token is not valid");
    }
    const decodeObj = await jwt.verify(token, "DEVTInder&786");
    const { _id } = decodeObj;

    const user = await User.findById(_id);
    if (!user) {
      throw new Error("user not found");
    }
    next();
  } catch (err) {
    res.status(400).send("Error : " + err.message);
  }
  // validate the token
  // find the user
};
module.exports = {
  userAuth,
};
