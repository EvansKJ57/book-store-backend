import { Router } from 'express';
import { userValidatorConfig } from '../middleware/validationRules';
import validateRequest from '../middleware/validateRequest';
import UserController from '../controller/userController';
const router = Router();

router.post(
  '/join',
  [
    userValidatorConfig.email,
    userValidatorConfig.name,
    userValidatorConfig.password,
    validateRequest,
  ],
  UserController.create
);

router.post(
  '/reset',
  [userValidatorConfig.email, validateRequest],
  UserController.pwResetRequest
);

router.put(
  '/reset',
  [userValidatorConfig.email, userValidatorConfig.password, validateRequest],
  UserController.pwReset
);

export default router;
