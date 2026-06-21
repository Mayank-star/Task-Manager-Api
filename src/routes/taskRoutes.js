const express = require("express");
const router = express.Router();

const authMiddleware =
  require(
    "../middleware/authMiddleware.js"
  );

const {
  createTask,
  getAllTasks,
  getTaskById
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
router.get(
  "/:id",
  authMiddleware,
  getTaskById
);

module.exports = router;
