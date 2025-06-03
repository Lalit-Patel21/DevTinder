const express = require("express");
const userRouter = express.Router();
const User = require("../models/user");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills";

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);
    // .populate("fromUserId",USER_SAFE_DATA);
    // ["firstName", "lastName"]=USER_SAFE_DATA
    // const data = connectionRequest.map((row) => row.fromUserId);
    const data = connectionRequests.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });

    res.json({
      message: "matches fatched succesfully",
      data: data,
    });
  } catch (err) {
    res.status(400).send("Error : " + err.message);
  }
});
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA);
    // .populate("fromUserId","firstName lastName photoUrl age gender about skills");
    res.json({ message: "data fatched succesfully", data: connectionRequests });
  } catch (err) {
    res.status(400).send("Error : " + err.message);
  }
});

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;

    const skip = (page - 1) * limit;

    const connectionRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    console.log(connectionRequests);

    // .select("fromUserId toUserId") .populate("fromUserId", "firstName").populate("toUserId", "firstName");
    // populate("fromUserId", USER_SAFE_DATA);

    const hideUsersFromfeed = new Set();
    connectionRequests.forEach((req) => {
      hideUsersFromfeed.add(req.fromUserId.toString());
      hideUsersFromfeed.add(req.toUserId.toString());
    });
    console.log(hideUsersFromfeed);

    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromfeed) } },
        {
          _id: { $ne: loggedInUser._id },
        },
      ],
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);
    console.log(users);

    res.json({ message: "user feed fatched succesfully", data: users });
  } catch (err) {
    // res.status(400).send("Error : " + err.message);
    res.status(400).json({ message: "Error : " + err.message });
  }
});

module.exports = userRouter;
