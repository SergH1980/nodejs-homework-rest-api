const app = require("./app");
const mongoose = require("mongoose");

const DB_URI =
  "mongodb+srv://serhii1980:k7u4bFDwmCEWAuVZ@cluster0.nv2flua.mongodb.net/db-contacts?w=majority";

mongoose
  .connect(DB_URI)
  .then(() => {
    app.listen(3000);
    console.log("Database connection successful");
  })
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });
