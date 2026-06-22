const { validationResult } = require("express-validator");

const validationMiddleware = (
  req,
  res,
  next
) => {

  const errors =
    validationResult(req);

  if (!errors.isEmpty()) {

    const formattedErrors =
      errors.array().map(
        (error) => ({
          field: error.path,
          message: error.msg,
        })
      );

    return res.status(400).json({
      success: false,
      errors: formattedErrors,
    });
  }

  next();
};

module.exports =
validationMiddleware;