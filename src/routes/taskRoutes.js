const express = require("express");
const router = express.Router();

const authMiddleware =
  require(
    "../middleware/authMiddleware.js"
  );

const {
  createTask,
} = require(
  "../controllers/taskController.js"
);

router.get(
  "/",
  authMiddleware,
  createTask
);

module.exports = router;
