const express = require("express");
const router = express.Router();

const authMiddleware =
  require(
    "../middleware/authMiddleware.js"
  );

const {
  getProfile,
} = require(
  "../controllers/userController.js"
);
const roleMiddleware = require("../middleware/roleMiddleware.js");

router.get(
  "/profile",
  authMiddleware,
  getProfile
);

router.delete(
  "/users/:id",
  authMiddleware,
  roleMiddleware('admin'),
  getProfile
);


module.exports = router;
