const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URI, {});

const connection = mongoose.connection;

connection.on("connected", () => {
  console.log("Connection to MongoDB is successful");
});
