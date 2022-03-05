const express = require("express");
const router = express.Router();

const { getContests } = require("../controllers/contestController");

const { protect } = require("../middleware/authMiddleware");

router.route("/all").get(protect, getContests);
router.route("/create").post(protect);
router.route("/join/:id").put(protect);
router.route("/:id").put(protect, updateGoal).delete(protect, deleteGoal);

module.exports = router;
