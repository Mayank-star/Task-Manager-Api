const express = require("express");
const router = express.Router();

const authMiddleware =
  require(
    "../middleware/authMiddleware.js"
  );

const {
  createTask,
  getAllTasks
} = require(
  "../controllers/taskController.js"
);

router.post(
  "/",
  authMiddleware,
  createTask
);

router.get(
  "/",
  authMiddleware,
  getAllTasks
);

module.exports = router;
