const asyncHandler = require("express-async-handler");
const Contest = require("../models/contestModel");

/** Fetches all contests related to a user. */
const getContests = asyncHandler(async (req, res) => {
  const contests = await Contest.find({ users: req.user.id });
  res.status(200).json(contests);
});

/** Creates a new contest. */
const createContest = asyncHandler(async (req, res) => {});

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
