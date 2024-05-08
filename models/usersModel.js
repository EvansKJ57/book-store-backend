const mariadb = require('../db/mariadb');

const createUser = async ({
  email,
  name,
  pw,
  salt,
  provider = 'LOCAL',
  provider_userId = null,
}) => {
  const insertUserQuery = `INSERT INTO users (email, name, password, salt, provider, provider_user_id) 
    values ( ? , ? , ? , ? , ? , ?) `;
  const values = [email, name, pw, salt, provider, provider_userId];
  const [results] = await mariadb.execute(insertUserQuery, values);
  return results;
};

const findUserById = async (userId) => {
  const selectUserByIdQuery = `SELECT * FROM users WHERE id = ?`;
  const value = [userId];
  const [results] = await mariadb.execute(selectUserByIdQuery, value);
  return results[0];
};

const findUserByEmail = async (email) => {
  const selectUserByEmailQuery = `SELECT * FROM users WHERE email = ? `;
  const values = [email];
  const [results] = await mariadb.execute(selectUserByEmailQuery, values);
  return results[0];
};

const updatePw = async (requestedHashPw, salt, email) => {
  const updateUserPwQuery = `UPDATE users 
      SET password =  ? , salt = ? WHERE email = ? `;
  const values = [requestedHashPw, salt, email];
  const [results] = await mariadb.execute(updateUserPwQuery, values);
  return results;
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  updatePw,
};
