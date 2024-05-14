import { StatusCodes } from 'http-status-codes';
import crypto from 'crypto';

import CustomError from '../util/CustomError';
import UsersModel from '../models/usersModel';
import { IFoundUser, ISubmittedUSerData } from '../types/customTypes';
import { createUserTransaction } from '../models/transaction/createUserTransaction';

const createUser = async ({
  email,
  password,
  name,
  provider = 'LOCAL',
  provider_userId = null,
}: ISubmittedUSerData) => {
  try {
    const salt = crypto.randomBytes(10).toString('base64');
    const requestedHashPw = crypto
      .pbkdf2Sync(password, salt, 10000, 10, 'sha512')
      .toString('base64');
    const createdUserId = await createUserTransaction({
      email,
      name,
      provider,
      provider_userId,
      password: requestedHashPw,
      salt: salt,
    });
    return createdUserId as number;
  } catch (error: any) {
    throw new CustomError(
      '유저 생성 오류',
      StatusCodes.INTERNAL_SERVER_ERROR,
      error
    );
  }
};
const findUser = async (param: string | number) => {
  try {
    let foundUser: IFoundUser;
    if (typeof param === 'number') {
      foundUser = await UsersModel.findUserById(param);
    } else {
      // (typeof param === 'string')
      foundUser = await UsersModel.findUserByEmail(param);
    }
    return foundUser;
  } catch (error: any) {
    throw new CustomError('sql 오류', StatusCodes.INTERNAL_SERVER_ERROR, error);
  }
};

const pwResetRequest = async (email: string) => {
  try {
    const foundUser = await UsersModel.findUserByEmail(email);
    if (!foundUser) {
      throw new CustomError(
        '해당 이메일이 존재 하지 않음',
        StatusCodes.UNAUTHORIZED
      );
    }
    return foundUser;
  } catch (error: any) {
    throw new CustomError('sql 오류', StatusCodes.INTERNAL_SERVER_ERROR, error);
  }
};

const pwReset = async (email: string, password: string) => {
  try {
    const salt = crypto.randomBytes(10).toString('base64');
    const requestedHashPw = crypto
      .pbkdf2Sync(password, salt, 10000, 10, 'sha512')
      .toString('base64');
    const results = await UsersModel.updatePw(requestedHashPw, salt, email);
    return results;
  } catch (error: any) {
    throw new CustomError('sql 오류', StatusCodes.INTERNAL_SERVER_ERROR, error);
  }
};

export default { createUser, pwResetRequest, pwReset, findUser };
