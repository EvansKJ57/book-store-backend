const { StatusCodes } = require('http-status-codes');
const crypto = require('crypto');

const CustomError = require('../util/CustomError');
const UsersModel = require('../models/usersModel');

const createUser = async (email, name, password, provider, provider_userId) => {
  try {
    const salt = crypto.randomBytes(10).toString('base64');
    const requestedHashPw = crypto
      .pbkdf2Sync(password, salt, 10000, 10, 'sha512')
      .toString('base64');
    let results;
    if (provider && provider_userId) {
      results = await UsersModel.createOauth(
        email,
        name,
        requestedHashPw,
        salt,
        provider,
        provider_userId
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
const findUser = async (param) => {
  try {
    let results;
    if (typeof param === 'number') {
      results = await UsersModel.findUserById(param);
    } else if (typeof param === 'string') {
      results = await UsersModel.findUserByEmail(param);
    }
    return results;
  } catch (error) {
    throw new CustomError('sql 오류', StatusCodes.INTERNAL_SERVER_ERROR, error);
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

module.exports = { createUser, pwResetRequest, pwReset, findUser };
