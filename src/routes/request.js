const express = require("express");
const requestRouter = express.Router();
//const User = require("../models/user");
//const { validateSignUpData } = require("../utils/validation");
const { userAuth } = require("../middlewares/auth");

requestRouter.post(
  "/request/send/interested/:userId",
  userAuth,
  async (req, res) => {
    try {
      res.send("user logegd in successfully");
    } catch (err) {
      res.status(400).send("Error : " + err.message);
    }
  }
);
requestRouter.post(
  "/request/send/ignored/:userId",
  userAuth,
  async (req, res) => {
    try {
      res.send("user logegd in successfully");
    } catch (err) {
      res.status(400).send("Error : " + err.message);
    }
  }
);
requestRouter.post(
  "/request/review/accepeted/:requestId",
  userAuth,
  async (req, res) => {
    try {
      res.send("user logegd in successfully");
    } catch (err) {
      res.status(400).send("Error : " + err.message);
    }
  }
);
requestRouter.post(
  "/request/review/rejected/:requestId",
  userAuth,
  async (req, res) => {
    try {
      res.send("user logegd in successfully");
    } catch (err) {
      res.status(400).send("Error : " + err.message);
    }
  }
);

module.exports = requestRouter;
