const mongoose = require("mongoose");

const problemSchema = mongoose.Schema({
  name: String,
  problemLink: String,
  rating: Number,
  points: Number,
  problemId: String,
});

const contestantSchema = {
  username: String,
  userId: String,
  points: Number,
  rank: Number,
};

const contestSchema = mongoose.Schema(
  {
    users: {
      type: [mongoose.Schema.Types.ObjectId],
      required: true,
      ref: "Users",
    },
    duration: {
      type: Number,
      required: true,
    },
    problems: {
      type: [problemSchema],
      required: true,
    },
    contestants: {
      type: [contestantSchema],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Contest", contestSchema);
