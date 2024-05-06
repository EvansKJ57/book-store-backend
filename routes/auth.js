const express = require('express');
const router = express.Router();

const authController = require('../controller/authController');
const { userValidatorConfig } = require('../middleware/validationRules');
const validateRequest = require('../middleware/validateRequest');

//OIDC - google
router.get('/oauth/google/login', authController.requestGoogleOpenIDConnect);

//OIDC - google redirect
router.get('/oauth/google/redirect', authController.loginGoogle);

// 로컬에서 유저 로그인
router.post(
  '/local/login',
  [userValidatorConfig.email, userValidatorConfig.password, validateRequest],
  authController.loginLocal
);
// 엑세스 토큰은 json으로 res, 리프레쉬 토큰은 쿠키에 담아서  res
router.post('/reissue-access-token', authController.reissueAcToken);

router.post('/logout', authController.logout);

module.exports = router;
