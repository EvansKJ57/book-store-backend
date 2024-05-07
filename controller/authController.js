const { StatusCodes } = require('http-status-codes');
const qs = require('qs');
const crypto = require('crypto');

const CustomError = require('../util/CustomError');
const UserService = require('../service/userService');
const authService = require('../service/authService');
const generateRandomString = require('../util/generateRandomString');
const cookieOpt = require('../util/cookieOption');

const requestGoogleOpenIDConnect = (req, res) => {
  const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
  const state = generateRandomString(16); // CSRF 방지 난수
  const nonce = generateRandomString(16); // 재생 공격 방지
  const hashedNonce = crypto.createHash('sha256').update(nonce).digest('hex');
  const optionsStringify = qs.stringify({
    response_type: 'code',
    prompt: 'consent',
    scope: 'openid email profile', // access_type: 'online',
    redirect_uri: process.env.GOOGLE_REDIRECT_URI,
    client_id: process.env.GOOGLE_CLIENT_ID,
    state: state,
    nonce: hashedNonce,
  });
  res.cookie('state', state, cookieOpt.OauthGoogle);
  res.cookie('nonce', nonce, cookieOpt.OauthGoogle);
  res.redirect(`${rootUrl}?${optionsStringify}`);
};

const loginGoogle = async (req, res) => {
  try {
    const queryParse = qs.parse(req.query);
    const { state, nonce } = req.cookies;
    if (state !== queryParse.state || !nonce) {
      throw new CustomError('invalid state or nonce', StatusCodes.BAD_REQUEST);
    }
    const tokenResponse = await authService.getAcTokenAndIdTokenFromGoogle(
      queryParse.code
    );

    const payload = await authService.checkIdTokenFromGoogle(
      tokenResponse.data.id_token,
      nonce
    );

    let foundUser = await UserService.findUser(payload.email);
    if (foundUser.length === 0) {
      const createResults = await UserService.createUser(
        payload.email,
        payload.name,
        generateRandomString(8, 'base64'),
        'GOOGLE',
        payload.sub
      );
      foundUser = await UserService.findUser(createResults.insertId);
    }
    const [user, acToken, rfToken] = await authService.loginUser(
      foundUser[0].email,
      foundUser[0].password,
      'GOOGLE'
    );
    // console.log(user);
    // 쿠키에서 nonce값 삭제
    res.cookie('nonce', '', {
      ...cookieOpt.OauthGoogle,
      maxAge: 0,
    });
    res.cookie('token', rfToken, cookieOpt.rfToken);
    res.status(StatusCodes.OK).json({ email: user.email, acToken: acToken });
  } catch (error) {
    throw error;
  }
};

const loginLocal = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const [user, acToken, rfToken] = await authService.loginUser(
      email,
      password,
      'LOCAL'
    );
    // 엑세스 토큰은 json으로 res, 리프레쉬 토큰은 쿠키에 담아서  res
    res.cookie('token', rfToken, cookieOpt.rfToken);
    res.status(StatusCodes.OK).json({ email: user.email, acToken });
  } catch (error) {
    throw error;
  }
};

const reissueAcToken = async (req, res, next) => {
  try {
    const rfToken = req.cookies.token;
    if (!rfToken) {
      throw new CustomError('token 없음', StatusCodes.BAD_REQUEST);
    }
    const acToken = await authService.reissueAcToken(rfToken);

    res.status(StatusCodes.OK).json({ acToken: acToken });
  } catch (error) {
    if (!error.statusCode) {
      if (error.name === 'JsonWebTokenError') {
        error.statusCode = StatusCodes.BAD_REQUEST;
      } else if (error.name === 'TokenExpiredError') {
        error.statusCode = StatusCodes.UNAUTHORIZED;
      }
    }
    throw error;
  }
};

const logout = async (req, res, next) => {
  try {
    const rfToken = req.cookies.token;
    await authService.logout(rfToken);
    res.cookie('token', '', {
      ...cookieOpt.rfToken,
      maxAge: 0,
    });
    res.status(StatusCodes.OK).json({ msg: '로그아웃 성공' });
  } catch (error) {
    throw new CustomError(
      '로그아웃 처리중 오류',
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

module.exports = {
  requestGoogleOpenIDConnect,
  loginGoogle,
  loginLocal,
  reissueAcToken,
  logout,
};
