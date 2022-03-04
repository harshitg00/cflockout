const express = require("express");
const app = express();
const colors = require("colors");
const dotenv = require("dotenv").config();
const connectDb = require("./config/db");
const port = process.env.PORT || 5000;

connectDb();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
