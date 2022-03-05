const asyncHandler = require("express-async-handler");
const Contest = require("../models/contestModel");

/**
 * Fetches all the contests of a user.
 * @param {object} req
 * @param {object} res
 * @route GET /api/contests
 * @access PRIVATE
 */
const getContests = asyncHandler(async (req, res) => {
  const contests = await Contest.find({ user: req.user.id });
  res.status(200).json(contests);
});

/**
 * Sets a goal.
 * @param {object} req
 * @param {object} res
 * @route POST /api/goals
 * @access PRIVATE
 */
const setGoal = asyncHandler(async (req, res) => {
  if (!req.body.text) {
    res.status(400);
    throw new Error("Please add a text field in the body.");
  }

  const goal = await Goal.create({
    text: req.body.text,
    user: req.user.id,
  });

  res.status(200).json(goal);
});

/**
 * Updates a goal with a given id.
 * @param {object} req
 * @param {object} res
 * @route PUT /api/goals
 * @access PRIVATE
 */

const updateGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.findById(req.params.id);

  if (!req.user) {
    res.status(400);
    throw new Error("Goal not found!!");
  }
  if (goal.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error(`Access denied.`);
  }
  const updatedGoal = await Goal.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.status(200).json(updatedGoal);
});

/**
 * Deletes a goal.
 * @param {object} req
 * @param {object} res
 * @route POST /api/goals
 * @access PRIVATE
 */
const deleteGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.findById(req.params.id);

  if (!goal) {
    res.status(400);
    throw new Error("Goal not found!");
  }
  if (goal.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error(`Access denied.`);
  }
  await Goal.remove(goal);

  res.status(200).json(goal);
});

module.exports = {
  getContests,
  setGoal,
  updateGoal,
  deleteGoal,
};
