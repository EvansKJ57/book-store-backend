const { StatusCodes } = require('http-status-codes');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const CustomError = require('../util/CustomError');
const UsersModel = require('../models/usersModel');

const createUser = async (email, name, password) => {
  try {
    const salt = crypto.randomBytes(10).toString('base64');
    const requestedHashPw = crypto
      .pbkdf2Sync(password, salt, 10000, 10, 'sha512')
      .toString('base64');

    const results = await UsersModel.create(email, name, requestedHashPw, salt);
    return results;
  } catch (error) {
    throw new CustomError(
      '유저 생성 오류',
      StatusCodes.INTERNAL_SERVER_ERROR,
      error
    );
  }
};

const loginUser = async (email, password) => {
  try {
    const results = await UsersModel.findUserByEmail(email);
    //일치하는 유저가 없는 경우
    console.log(results);
    if (results.length === 0) {
      throw new CustomError(
        '이메일 혹은 비밀번호가 다름',
        StatusCodes.UNAUTHORIZED
      );
    }
    const hashRequestPw = crypto
      .pbkdf2Sync(password, results[0].salt, 10000, 10, 'sha512')
      .toString('base64');
    //비밀번호 다른 경우
    if (results[0].password !== hashRequestPw) {
      //이메일이 다르거나 비밀번호가 다르면 여기서 에러 처리
      throw new CustomError(
        '이메일 혹은 비밀번호가 다름',
        StatusCodes.UNAUTHORIZED
      );
    }
    //jwt 토큰 발행
    const token = jwt.sign(
      { email: results[0].email, id: results[0].id },
      process.env.JWT_AC_KEY,
      { expiresIn: '30m' }
    );
    //토큰 쿠키에 담기
    console.log('로그인시 발행된 토큰 : ', token);
    return [results, token];
  } catch (error) {
    if (!error.statusCode) {
      throw new CustomError(
        '로그인 처리 중 오류',
        StatusCodes.INTERNAL_SERVER_ERROR,
        error
      );
    }
    throw error;
  }
};

const pwResetRequest = async (email) => {
  try {
    const results = await UsersModel.findUserByEmail(email);
    if (results.length === 0) {
      throw new CustomError(
        '해당 이메일이 존재 하지 않음',
        StatusCodes.UNAUTHORIZED
      );
    }
    return results[0];
  } catch (error) {
    throw new CustomError('sql 오류', StatusCodes.INTERNAL_SERVER_ERROR, error);
  }
};

const pwReset = async (email, password) => {
  try {
    const salt = crypto.randomBytes(10).toString('base64');
    const requestedHashPw = crypto
      .pbkdf2Sync(password, salt, 10000, 10, 'sha512')
      .toString('base64');
    const results = await UsersModel.updatePw(requestedHashPw, salt, email);
    return results;
  } catch (error) {
    throw new CustomError('sql 오류', StatusCodes.INTERNAL_SERVER_ERROR, error);
  }
};

module.exports = { createUser, loginUser, pwResetRequest, pwReset };
