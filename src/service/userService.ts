import { StatusCodes } from 'http-status-codes';
import crypto from 'crypto';

import CustomError from '../util/CustomError';
import UsersModel from '../models/usersModel';
import { IFoundUser } from '../types/customTypes';
import { ICreateUserReqBody } from '../types/ReqRelatedType';
import TransactionModel from '../models/transactionModel';

const UserService = {
  createUser: async ({
    email,
    password,
    name,
    provider = 'LOCAL',
    provider_userId = null,
  }: ICreateUserReqBody & {
    provider?: string;
    provider_userId?: string | null;
  }) => {
    try {
      const salt = crypto.randomBytes(10).toString('base64');
      const requestedHashPw = crypto
        .pbkdf2Sync(password, salt, 10000, 10, 'sha512')
        .toString('base64');
      const createdUserId = await TransactionModel.createUser({
        email,
        name,
        provider,
        provider_userId,
        password: requestedHashPw,
        salt: salt,
      });
      return createdUserId;
    } catch (error: any) {
      throw new CustomError(
        '유저 생성 오류',
        StatusCodes.INTERNAL_SERVER_ERROR,
        error
      );
    }
  },
  findUser: async (param: string | number) => {
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
      throw new CustomError(
        'sql 오류',
        StatusCodes.INTERNAL_SERVER_ERROR,
        error
      );
    }
  },

  pwResetRequest: async (email: string) => {
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
      throw new CustomError(
        'sql 오류',
        StatusCodes.INTERNAL_SERVER_ERROR,
        error
      );
    }
  },

  pwReset: async (email: string, password: string) => {
    try {
      const salt = crypto.randomBytes(10).toString('base64');
      const requestedHashPw = crypto
        .pbkdf2Sync(password, salt, 10000, 10, 'sha512')
        .toString('base64');
      const results = await UsersModel.updatePw(requestedHashPw, salt, email);
      return results;
    } catch (error: any) {
      throw new CustomError(
        'sql 오류',
        StatusCodes.INTERNAL_SERVER_ERROR,
        error
      );
    }
  },
};
export default UserService;
