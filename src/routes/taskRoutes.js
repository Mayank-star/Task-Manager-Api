const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware.js");

const {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
} = require("../controllers/taskController.js");
const { createTaskValidation } = require("../validations/taskValidation.js");
const validationMiddleware = require("../middleware/validationMiddleware.js");

router.post("/", authMiddleware, createTaskValidation,validationMiddleware, createTask);
router.get("/", authMiddleware, getAllTasks);
router.get("/:id", authMiddleware, getTaskById);
router.put("/:id", authMiddleware, updateTask);
router.delete("/:id", authMiddleware, deleteTask);

module.exports = router;
