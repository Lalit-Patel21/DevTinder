const express = require("express");
const connectDB = require("./config/dbconfig");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);

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
