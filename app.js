const express = require("express");
const app = express();
const dotenv = require("dotenv");
const postRoute = require("./Routes/postRoute");
const userRoute = require("./Routes/userRoute");
const bodyParser = require("body-parser");

dotenv.config({ path: "./config.env" });

app.use("/", (req, res) => {
  res.send("Application Running ✅💥⚡");
});

app.use(bodyParser.json());
app.use("/api/v1/posts", postRoute);
app.use("/api/v1/users", userRoute);

module.exports = app;
