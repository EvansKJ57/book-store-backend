const { StatusCodes } = require('http-status-codes');
const UserService = require('../service/userService');

const create = async (req, res, next) => {
  try {
    const { email, name, password } = req.body;
    const results = await UserService.createUser(email, name, password);
    res.status(StatusCodes.CREATED).json(results);
  } catch (error) {
    next(error);
  }
};
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const [results, acToken, rfToken] = await UserService.loginUser(
      email,
      password
    );
    // 엑세스 토큰은 json으로 res, 리프레쉬 토큰은 쿠키에 담아서  res
    res.cookie('token', rfToken, {
      httpOnly: true,
      maxAge: 86400000, // 세션쿠키가 아닌 영속 쿠키로 만들기, 하루 유지 옵션 설정
    });
    res.status(StatusCodes.OK).json({ email: results.email, acToken });
  } catch (error) {
    next(error);
  }
};

const pwResetRequest = async (req, res, next) => {
  try {
    const { email } = req.body;
    const results = await UserService.pwResetRequest(email);
    res.status(StatusCodes.OK).json({ email: results.email });
  } catch (error) {
    next(error);
  }
};

const pwReset = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const results = await UserService.pwReset(email, password);
    return res.status(StatusCodes.OK).json(results);
  } catch (error) {
    next(error);
  }
};

module.exports = { create, login, pwResetRequest, pwReset };
