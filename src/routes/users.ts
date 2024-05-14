import { Router } from 'express';
import { userValidatorConfig } from '../middleware/validationRules';
import validateRequest from '../middleware/validateRequest';
import userController from '../controller/userController';
const router = Router();

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
  '/reset',
  [userValidatorConfig.email, validateRequest],
  userController.pwResetRequest
);

router.put(
  '/reset',
  [userValidatorConfig.email, userValidatorConfig.password, validateRequest],
  userController.pwReset
);

export default router;
