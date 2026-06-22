const { body } = require("express-validator");

exports.createTaskValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required"),

  body("description")
    .optional()
    .isString()
    .withMessage(
      "Description must be string"
    ),
];