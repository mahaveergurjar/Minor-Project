const mongoose = require("mongoose");
const connection_string = "mongodb://localhost:27017/auth-db";
mongoose.connect(connection_string)
.then(() => {
  console.log("MongoDB connected successfully!!!");
})
.catch((err) => {
  console.error("MongoDB connection error:", err);
});