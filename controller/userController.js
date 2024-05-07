const { StatusCodes } = require('http-status-codes');
const UserService = require('../service/userService');

const create = async (req, res, next) => {
  try {
    const { email, name, password } = req.body;
    const results = await UserService.createUser({ email, name, pw: password });
    res.status(StatusCodes.CREATED).json(results);
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

module.exports = { create, pwResetRequest, pwReset };
