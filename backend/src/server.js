const mongoose = require("mongoose");
const dotenv = require("dotenv");

process.on("uncaughtException", (err) => {
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: `./config.env` });
const app = require("./app");

const port = process.env.PORT || 8000;
const DB = process.env.DATABASE_URL.replace(
  "<password>",
  process.env.DATABASE_PASSWORD
);
mongoose.connect(DB).then(() => {
  console.log("connection to database is successfull !!!");
});

const server = app.listen(port, () => {
  console.log(`Listening to port ${port}...`);
});

// catch async error
process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);

  // first close server and then exit app
  server.close(() => {
    // 0 for success and 1 for failure
    process.exit(1);
  });
});
