const express = require("express");
const connectDB = require("./config/dbconfig");
const User = require("./models/user");
const app = express();

app.use(express.json());

app.post("/signup", async (req, res) => {
  console.log(req.body);
  const user = new User(req.body);
  try {
    await user.save();
    res.send("user added successfully");
  } catch (err) {
    res.status(400).send("error saving the user:" + err.message);
  }
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
