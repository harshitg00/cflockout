const mongoose = require("mongoose");

const problemSchema = mongoose.Schema({
  name: String,
  problemLink: String,
  rating: Number,
  points: Number,
  problemId: String,
  isSolved: Boolean,
  solvedBy: mongoose.Schema.Types.ObjectId,
});

const contestantSchema = {
  username: String,
  userId: String,
  points: Number,
  rank: Number,
};

const contestSchema = mongoose.Schema(
  {
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
      },
    ],
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
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
      default: [],
      required: true,
    },
    isFinished: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Contest", contestSchema);
