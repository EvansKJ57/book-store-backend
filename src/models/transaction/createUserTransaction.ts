import mariadb from '../../db/mariadb';
import { IUserDataWithoutId } from '../../types/customTypes';
import tokensModel from '../tokensModel';
import usersModel from '../usersModel';

export const createUserTransaction = async (userData: IUserDataWithoutId) => {
  const conn = await mariadb.getConnection();
  try {
    await conn.beginTransaction();
    const createUserResult = await usersModel.insertUser(userData, conn);
    await tokensModel.insertTokenData(createUserResult.insertId, conn);
    await conn.commit();
    return createUserResult.insertId;
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
};
