const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const {
  MIN_NUMBER_OF_PROBLEMS,
  MAX_NUMBER_OF_PROBLEMS,
  MIN_DURATION,
  MAX_DURATION,
  MIN_PROBLEM_POINTS,
  MAX_PROBLEM_POINTS,
} = require("../config/constants");

const {
  getContests,
  createContest,
  joinContest,
  invalidateContest,
} = require("../controllers/contestController");

const { protect } = require("../middleware/authMiddleware");

router.route("/all").get(protect, getContests);
router.route("/create").post(
  [
    // Validating number of problems
    body(
      "problems",
      `Number of problems should be in between ${MIN_NUMBER_OF_PROBLEMS} and ${MAX_NUMBER_OF_PROBLEMS} `
    ).isArray({
      min: MIN_NUMBER_OF_PROBLEMS,
      max: MAX_NUMBER_OF_PROBLEMS,
    }),
    // Validating contest duration
    body(
      "duration",
      `Contest Duration should be in between ${MIN_DURATION} minutes and ${MAX_DURATION} minutes`
    ).isNumeric({ min: MIN_DURATION, max: MAX_DURATION }),
    // Validating points of every problem
    body(
      "problems.*.points",
      `Points of each problem should lie between ${MIN_PROBLEM_POINTS} and ${MAX_PROBLEM_POINTS}`
    ).isFloat({
      min: MIN_PROBLEM_POINTS,
      max: MAX_PROBLEM_POINTS,
    }),
  ],
  protect,
  createContest
);
router.route("/join/:id").put(protect, joinContest);
router.route("/invalidate/:id").post(protect, invalidateContest);

module.exports = router;
