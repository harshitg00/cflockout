const express = require("express");
const colors = require("colors");
const dotenv = require("dotenv").config();
const connectDb = require("./config/db");
const port = process.env.PORT || 5000;
const { errorHandler } = require("./middleware/errorMiddleware");

// Connect to MonogoDB.
connectDb();

const app = express();

// Add middlewares to parse json requests and url encoded bodies
// of requests.
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// All routes of the app.
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/contests", require("./routes/contestRoutes"));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Middleware to handle custom errors in `production` and
// `development` server.
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Cflockout app listening on port ${port}`);
});
