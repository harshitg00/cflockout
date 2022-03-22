const express = require("express");
const colors = require("colors");
const dotenv = require("dotenv").config();
const connectDb = require("./config/db");
const { createServer } = require("http");
const { Server } = require("socket.io");
const port = process.env.PORT || 5000;
const { errorHandler } = require("./middleware/errorMiddleware");
const path = require("path");

// Connect to MonogoDB.
connectDb();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {});

io.on("connection", (socket) => {
  console.log("A user connected!");
  socket.on("joinRoom", (contestId) => {
    console.log(`Joined ${contestId}`);
    socket.join(contestId);

    socket.on("updateContest", (contestId) => {
      // Broadcast a message that a user has joined.
      console.log("Emitting a contestUpdated event.");
      socket.broadcast.to(contestId).emit("contestUpdated", contestId);
    });
  });

  socket.on("leaveRoom", (contestId) => {
    console.log(`Left ${contestId}`);
    socket.leave(contestId);
  });
});

// Add middlewares to parse json requests and url encoded bodies
// of requests.
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// All routes of the app.
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/contests", require("./routes/contestRoutes"));

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/build")));

  app.get("*", (req, res) =>
    res.sendFile(
      path.resolve(__dirname, "../", "frontend", "build", "index.html")
    )
  );
} else {
  app.get("/", (req, res) =>
    res.send("This is dev server. Please set NODE_ENV to production.")
  );
}

// Middleware to handle custom errors in `production` and
// `development` server.
app.use(errorHandler);

httpServer.listen(port, () => {
  console.log(`Socket IO listening on port ${port}`);
});
