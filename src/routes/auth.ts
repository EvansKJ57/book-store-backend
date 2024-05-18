import { Router } from 'express';
import AuthController from '../controller/authController';
import { userValidatorConfig } from '../middleware/validationRules';
import validationRequest from '../middleware/validateRequest';

const router = Router();

//OIDC - google
router.get('/oauth/google/login', AuthController.requestGoogleOpenIDConnect);

//OIDC - google redirect
router.get('/oauth/google/redirect', AuthController.loginGoogle);

// 로컬에서 유저 로그인
router.post(
  '/local/login',
  [userValidatorConfig.email, userValidatorConfig.password, validationRequest],
  AuthController.loginLocal
);
// 엑세스 토큰은 json으로 res, 리프레쉬 토큰은 쿠키에 담아서  res
router.post('/reissue-access-token', AuthController.reissueAcToken);

router.post('/logout', AuthController.logout);

export default router;
