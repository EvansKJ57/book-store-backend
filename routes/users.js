const express = require('express');
const router = express.Router();

const { userValidatorConfig } = require('../middleware/validationRules');
const validateRequest = require('../middleware/validateRequest');
const userController = require('../controller/userController');

router.post(
  '/join',
  [
    userValidatorConfig.email,
    userValidatorConfig.name,
    userValidatorConfig.password,
    validateRequest,
  ],
  userController.create
);

router.post(
  '/login',
  [userValidatorConfig.email, userValidatorConfig.password, validateRequest],
  userController.login
);
router.post(
  '/reset',
  [userValidatorConfig.email, validateRequest],
  userController.pwResetRequest
);
router.put(
  '/reset',
  [userValidatorConfig.email, userValidatorConfig.password, validateRequest],
  userController.pwReset
);

module.exports = router;
