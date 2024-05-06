const { StatusCodes } = require('http-status-codes');
const crypto = require('crypto');

const CustomError = require('../util/CustomError');
const UsersModel = require('../models/usersModel');
const {
  issueAccessToken,
  issueRefreshToken,
} = require('../util/token/issueToken');

const createUser = async (email, name, password, provider, provider_id) => {
  try {
    const salt = crypto.randomBytes(10).toString('base64');
    const requestedHashPw = crypto
      .pbkdf2Sync(password, salt, 10000, 10, 'sha512')
      .toString('base64');
    let results;
    if (provider && provider_id) {
      results = await UsersModel.createOauth(
        email,
        name,
        requestedHashPw,
        salt,
        provider,
        provider_id
      );
    } else {
      results = await UsersModel.createLocal(
        email,
        name,
        requestedHashPw,
        salt
      );
    }
    return results;
  } catch (error) {
    throw new CustomError(
      '유저 생성 오류',
      StatusCodes.INTERNAL_SERVER_ERROR,
      error
    );
  }
};

const loginUser = async (email, password, provider) => {
  try {
    const results = await UsersModel.findUserByEmail(email);
    //일치하는 유저가 없는 경우

    if (results.length === 0) {
      throw new CustomError(
        '이메일 혹은 비밀번호가 다름',
        StatusCodes.UNAUTHORIZED
      );
    }
    const foundUser = results[0];
    const hashRequestPw = crypto
      .pbkdf2Sync(password, foundUser.salt, 10000, 10, 'sha512')
      .toString('base64');
    //비밀번호 다른 경우
    if (foundUser.password !== hashRequestPw) {
      throw new CustomError(
        '이메일 혹은 비밀번호가 다름',
        StatusCodes.UNAUTHORIZED
      );
    }

    const acToken = issueAccessToken(foundUser.email, foundUser.id);
    const rfToken = issueRefreshToken(foundUser.email, foundUser.id);
    await UsersModel.updateToken(foundUser.email, rfToken);

    console.log('로그인 시 발행된 엑세스 토큰 : ', acToken);
    console.log('로그인 시 발행된 리프레쉬 토큰 : ', rfToken);
    return [results, acToken, rfToken];
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
