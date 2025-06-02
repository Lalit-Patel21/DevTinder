const express = require("express");
const requestRouter = express.Router();
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const { userAuth } = require("../middlewares/auth");

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const allowedStatus = ["ignored", "interested"];
      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: "invalid status type:" + status });
      }
      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(400).send({ message: "User not found!!" });
      }
      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          {
            fromUserId,
            toUserId,
          },
          {
            fromUserId: toUserId,
            toUserId: fromUserId,
          },
        ],
      });
      if (existingConnectionRequest) {
        return res
          .status(400)
          .send({ message: "connection request already exists!!" });
      }
      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });
      const data = await connectionRequest.save();
      res.json({
        message:
          req.user.firstName + " is " + status + " in " + toUser.firstName,
        data,
      });
    } catch (err) {
      res.status(400).send("Error : " + err.message);
    }
  }
);
// requestRouter.post(
//   "/request/send/ignored/:userId",
//   userAuth,
//   async (req, res) => {
//     try {
//       res.send("user logegd in successfully");
//     } catch (err) {
//       res.status(400).send("Error : " + err.message);
//     }
//   }
// );
requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;

      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: "invalid status type:" + status });
      }

      // console.log(requestId, loggedInUser._id);
      const connectionRequest = await ConnectionRequest.findOne({
        fromUserId: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });
      // console.log(connectionRequest);

      if (!connectionRequest) {
        return res
          .status(404)
          .send({ message: "connection request not found!" });
      }
      connectionRequest.status = status;
      const data = await connectionRequest.save();
      res.json({
        message: "Connection Request " + status,
        data,
      });
    } catch (err) {
      res.status(400).send("Error : " + err.message);
    }
  }
);
// requestRouter.post(
//   "/request/review/rejected/:requestId",
//   userAuth,
//   async (req, res) => {
//     try {
//       res.send("user logegd in successfully");
//     } catch (err) {
//       res.status(400).send("Error : " + err.message);
//     }
//   }
// );

module.exports = requestRouter;
