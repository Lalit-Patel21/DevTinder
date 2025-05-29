const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://lalitpatel21:Lalit21@testingmongodb.zcpqw.mongodb.net/devTinder"
  );
};
module.exports = connectDB;
