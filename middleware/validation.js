const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const loginValidation = [
  body('username')
    .isLength({ min: 3 })
    .withMessage('Username must be at least 3 characters long')
    .trim()
    .escape(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
];

const postValidation = [
  body('title')
    .isLength({ min: 1 })
    .withMessage('Title is required')
    .trim()
    .escape(),
  body('content')
    .isLength({ min: 1 })
    .withMessage('Content is required')
    .trim()
    .escape()
];

module.exports = {
  handleValidationErrors,
  loginValidation,
  postValidation
};