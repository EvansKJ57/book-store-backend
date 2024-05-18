import mariadb from '../db/mariadb';
import { IFoundUser, IUserDataWithoutId } from '../types/customTypes';
import { ResultSetHeader, PoolConnection } from 'mysql2/promise';

const UsersModel = {
  insertUser: async (
    {
      email,
      name,
      password,
      salt,
      provider,
      provider_userId,
    }: IUserDataWithoutId,
    conn: PoolConnection
  ) => {
    const insertUserQuery = `INSERT INTO users (email, name, password, salt, provider, provider_user_id) 
    values ( ? , ? , ? , ? , ? , ?) `;
    const values = [email, name, password, salt, provider, provider_userId];
    const [results] = await conn.execute<ResultSetHeader>(
      insertUserQuery,
      values
    );
    return results;
  },

  findUserById: async (userId: number) => {
    const selectUserByIdQuery = `SELECT * FROM users WHERE id = ?`;
    const value = [userId];
    const [results] = await mariadb.execute<IFoundUser[]>(
      selectUserByIdQuery,
      value
    );
    return results[0];
  },
  findUserByEmail: async (email: string) => {
    const selectUserByEmailQuery = `SELECT * FROM users WHERE email = ? `;
    const values = [email];
    const [results] = await mariadb.execute<IFoundUser[]>(
      selectUserByEmailQuery,
      values
    );
    return results[0];
  },

  updatePw: async (requestedHashPw: string, salt: string, email: string) => {
    const updateUserPwQuery = `UPDATE users 
      SET password =  ? , salt = ? WHERE email = ? `;
    const values = [requestedHashPw, salt, email];
    const [results] = await mariadb.execute<ResultSetHeader>(
      updateUserPwQuery,
      values
    );
    return results;
  },
};
export default UsersModel;
