import mariadb from '../db/mariadb';
import { IFoundUser, ILoginUser } from '../types/customTypes';
import { ResultSetHeader } from 'mysql2/promise';

const createUser = async ({
  email,
  name,
  password,
  salt,
  provider = 'LOCAL',
  provider_userId = null,
}: ILoginUser) => {
  const insertUserQuery = `INSERT INTO users (email, name, password, salt, provider, provider_user_id) 
    values ( ? , ? , ? , ? , ? , ?) `;
  const values = [email, name, password, salt, provider, provider_userId];
  const [results] = await mariadb.execute<ResultSetHeader>(
    insertUserQuery,
    values
  );
  return results;
};

const findUserById = async (userId: number) => {
  const selectUserByIdQuery = `SELECT * FROM users WHERE id = ?`;
  const value = [userId];
  const [results] = await mariadb.execute<IFoundUser[]>(
    selectUserByIdQuery,
    value
  );
  return results[0];
};
const findUserByEmail = async (email: string) => {
  const selectUserByEmailQuery = `SELECT * FROM users WHERE email = ? `;
  const values = [email];
  const [results] = await mariadb.execute<IFoundUser[]>(
    selectUserByEmailQuery,
    values
  );
  return results[0];
};

const updatePw = async (
  requestedHashPw: string,
  salt: string,
  email: string
) => {
  const updateUserPwQuery = `UPDATE users 
      SET password =  ? , salt = ? WHERE email = ? `;
  const values = [requestedHashPw, salt, email];
  const [results] = await mariadb.execute<ResultSetHeader>(
    updateUserPwQuery,
    values
  );
  return results;
};

export default { createUser, findUserByEmail, findUserById, updatePw };
