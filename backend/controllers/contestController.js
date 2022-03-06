const asyncHandler = require("express-async-handler");
const { validationResult } = require("express-validator");
const Contest = require("../models/contestModel");

/** Fetches all contests related to a user. */
const getContests = asyncHandler(async (req, res) => {
  const contests = await Contest.find({ users: req.user.id });
  res.status(200).json(contests);
});

/** Creates a new contest. */
const createContest = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { duration, problems } = req.body;

  const admin = req.user._id;
  const users = [admin];
  const contestants = [
    {
      username: req.user.username,
      userId: req.user._id,
      points: 0,
      rank: 1,
    },
  ];

  const contest = await Contest.create({
    users,
    admin,
    duration,
    problems,
    contestants,
  });

  res.status(201).json(contest);
});

/** Updates a goal with the given id. */
const joinContest = asyncHandler(async (req, res) => {});

/** Ends a contest with the given id. */
const invalidateContest = asyncHandler(async (req, res) => {});

module.exports = {
  getContests,
  createContest,
  joinContest,
  invalidateContest,
};
