const asyncHandler = require("express-async-handler");
const { validationResult } = require("express-validator");
const Contest = require("../models/contestModel");
const { MAX_PLAYERS } = require("../config/constants");

const getUpdatedContestantsList = async (
  contestantsList,
  userId,
  pointsAwarded
) => {
  contestantsList.forEach((contestant) => {
    if (contestant.userId === userId) {
      contestant.points += pointsAwarded;
    }
  });
  contestantsList.sort(
    (contestant1, contestant2) => contestant1.points < contestant2.points
  );
  let rank = 1;
  for (contestant in contestantsList) {
    contestant.rank = rank++;
  }
  return contestantsList;
};

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

  const admin = req.user.id;
  const users = [admin];
  const contestants = [
    {
      username: req.user.username,
      userId: req.user.id,
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

/** Allows a user to join a contest. */
const joinContest = asyncHandler(async (req, res) => {
  const ongoingContest = await Contest.findById(req.params.contestId);
  if (!ongoingContest) {
    res.status(404);
    throw new Error("No contest found!");
  }

  if (ongoingContest.isFinished) {
    res.status(408);
    throw new Error("This contest is already finished!");
  }

  ongoingContest.users.forEach((user) => {
    if (user === req.user.id) {
      res.status(409);
      throw new Error("User is already participating in the contest!");
    }
  });

  if (ongoingContest.users.length >= MAX_PLAYERS) {
    res.status(400);
    throw new Error("Maximum limit of players reached!");
  }

  const contestant = {
    username: req.user.username,
    points: 0,
    rank: ongoingContest.contestants.length + 1,
    userId: req.user.id,
  };

  const updatedContest = await Contest.findOneAndUpdate(
    { _id: req.params.contestId },
    {
      $addToSet: { contestants: contestant, users: req.user.id },
    },
    { returnOriginal: false }
  );

  res.status(201).json(updatedContest);
});

/**
 * Sets a problem as solved and doesn't allow to be solved again.
 * Body of the request needs problemId and userId who solved the question.
 * @param contestId
 */
const solveProblem = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const ongoingContest = await Contest.findById(req.params.contestId);
  if (!ongoingContest) {
    res.status(404);
    throw new Error("No contest found!");
  }

  if (ongoingContest.isFinished) {
    res.status(408);
    throw new Error("This contest is already finished!");
  }

  if (req.user.id !== ongoingContest.admin) {
    res.status(401);
    throw new Error("Not authorized for this request.");
  }

  const problems = ongoingContest.problems.filter(
    (problem) => problem.problemId.toString() === req.body.problemId
  );

  if (problems.length === 0) {
    res.status(400);
    throw Error("Invalid problemId");
  }

  if (problems[0].isSolved) {
    res.status(400);
    throw Error("This problem has already been solved!");
  }

  let contestantsList = ongoingContest.contestants;

  contestantsList = await getUpdatedContestantsList(
    contestantsList,
    req.body.userId.toString(),
    problems[0].points
  );

  const updatedContest = await Contest.findOneAndUpdate(
    { _id: req.params.contestId },
    {
      $set: {
        "problems.$[element].isSolved": true,
        "problems.$[element].solvedBy": req.body.userId.toString(),
        contestants: contestantsList,
      },
    },
    {
      arrayFilters: [{ "element.problemId": req.body.problemId }],
      returnOriginal: false,
    }
  );

  res.status(201).json(updatedContest);
});

/** Ends a contest with the given id. */
const invalidateContest = asyncHandler(async (req, res) => {
  const ongoingContest = await Contest.findById(req.params.contestId);

  if (!ongoingContest) {
    res.status(404);
    throw new Error("No contest found!");
  }

  if (ongoingContest.isFinished) {
    res.status(408);
    throw new Error("This contest is already finished!");
  }

  if (req.user.id !== ongoingContest.admin) {
    res.status(401);
    throw new Error("Not authorized for this request.");
  }

  const invalidatedContest = await Contest.findOneAndUpdate(
    { _id: req.params.contestId },
    { isFinished: true },
    { returnOriginal: false,}
  );

  res.status(201).json(invalidatedContest);
});

module.exports = {
  getContests,
  createContest,
  joinContest,
  solveProblem,
  invalidateContest,
};
