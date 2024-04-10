const express = require('express');
const { body } = require('express-validator');
const validationRequest = require('../middleware/validationRequest');

const userController = require('../controller/user-controller');

const router = express.Router();

router.post(
  '/join',
  [
    body('email').notEmpty().isEmail(),
    body('name').notEmpty().isLength({ min: 4 }),
    body('password').notEmpty().isString(),
    validationRequest,
  ],
  userController.create
);

router.post(
  '/login',
  [
    body('email').notEmpty().isEmail(),
    body('password').notEmpty().isString(),
    validationRequest,
  ],
  userController.login
);
router.post(
  '/reset',
  [body('email').notEmpty().isEmail(), validationRequest],
  userController.pwResetRequest
);
router.put(
  '/reset',
  [
    body('email').notEmpty().isEmail(),
    body('password').notEmpty().isString(),
    validationRequest,
  ],
  userController.pwReset
);

module.exports = router;
