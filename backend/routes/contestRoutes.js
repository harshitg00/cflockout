const express = require("express");
const router = express.Router();

const {
  getContests,
  createContest,
  joinContest,
  invalidateContest,
} = require("../controllers/contestController");

const { protect } = require("../middleware/authMiddleware");

router.route("/all").get(protect, getContests);
router.route("/create").post(protect, createContest);
router.route("/join/:id").put(protect, joinContest);
router.route("/invalidate/:id").post(protect, invalidateContest);

module.exports = router;
