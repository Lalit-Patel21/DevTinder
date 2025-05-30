const express = require("express");
const connectDB = require("./config/dbconfig");
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const validator = require("validator");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
  try {
    console.log(req.body);

    // validation of data
    validateSignUpData(req);

    //encrypt the password
    const { firstName, lastName, emailId, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    console.log(passwordHash);
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });
    await user.save();
    res.send("user added successfully");
  } catch (err) {
    res.status(400).send("Error : " + err.message);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    if (!validator.isEmail(emailId)) {
      throw new Error("email id is not valid");
    }
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid credentials");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      //create a jwt token
      const token = await jwt.sign({ _id: userId }, "DEVTInder@786", {
        expiresIn: "1d",
      });
      // add the token to cookie and send the response back to the user
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });
      res.send("login Successfully!!!!");
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (err) {
    res.status(400).send("Error : " + err.message);
  }
});

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("Error : " + err.message);
  }
  // try {
  //   const cookies = req.cookies;
  //   const { token } = cookies;
  //   if (!token) {
  //     throw new Error("token is not valid");
  //   }
  //   const decodeMessage = await jwt.verify(token, "DEVTINDER&786");
  //   const { _id } = decodeMessage;

  //   const user = await User.findById(_id);
  //   if (!user) {
  //     throw new Error("user not found");
  //   }
  //   res.send(user);
  // } catch (err) {
  //   res.status(400).send("Error : " + err.message);
  // }
});

app.get("/users", async (req, res) => {
  const userEmailId = req.body.emailId;
  try {
    const users = await User.find({ emailId: userEmailId });
    if (users.length === 0) {
      res.status(404).send("user not found");
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(400).send("something went wrong:" + err.message);
  }
});

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(400).send("something went wrong:" + err.message);
  }
});

app.delete("/user", async (req, res) => {
  const userId = req.body.userId;

  try {
    const user = await User.findByIdAndDelete({ _id: userId });
    // const user = await User.findByIdAndDelete({ userId });
    res.send("user deleted successfully");
  } catch (err) {
    res.status(400).send("something went wrong:" + err.message);
  }
});

app.patch("/user", async (req, res) => {
  const userId = req.body.userId;
  const data = req.body;

  try {
    const AllOWED_UPDATES = ["photoUrl", "about", "gender", "age", "skills"];
    const isUpdateAllowed = Object.keys(data).every((k) => {
      AllOWED_UPDATES.includes(k);
    });
    if (!isUpdateAllowed) {
      throw new Error("update not allowed");
    }
    if (data?.skills.length > 20) {
      throw new Error("skills can not be more than 10");
    }

    const user = await User.findByIdAndUpdate({ _id: userId }, data, {
      returnDocument: "after",
      runValidators: true,
    });
    // const user = await User.findByIdAndDelete({ userId });
    res.send("user updated successfully");
  } catch (err) {
    res.status(400).send("something went wrong:" + err.message);
  }
});

connectDB()
  .then(() => {
    console.log("database connection successfull eastablished...");
    app.listen(3000, () => {
      console.log("server is listening on port 3000....");
    });
  })
  .catch((err) => {
    console.error("database connection canot be  eastablished...");
  });

//   res.end("server is on");
//console.log("");
// app.use("/admin", (req, res) => {
//   res.send("hello from the server admin");
// });

// app.use("/user", (req, res) => {
//   res.send("hello from the server user");
// });

// app.use("/", (req, res) => {
//   res.send("hello from the server");
// });

// app.post("/signup", async (req, res) => {
// const user = new User({
//   firstName: "lalit",
//   lastName: "patel",
//   emailId: "lalitpatel111.da@gmail.com",
//   password: "Lalit@123",
//   age: "25",
// });
// try {
//   await user.save();
//   res.send("user added successfully");
// } catch (err) {
//   res.status(400).send("error saving the user:" + err.message);
// }
// });
