const { StatusCodes } = require('http-status-codes');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const mariadb = require('../db/mariadb');

const create = (req, res, next) => {
  const { email, name, password } = req.body;

  const salt = crypto.randomBytes(10).toString('base64');
  const requestedHashPw = crypto
    .pbkdf2Sync(password, salt, 10000, 10, 'sha512')
    .toString('base64');

  let sql = `INSERT INTO users (email, name, password, salt) Values (? , ? , ?, ?) `;
  let value = [email, name, requestedHashPw, salt];
  mariadb.query(sql, value, (error, results) => {
    if (error) {
      const errorObj = new Error('sql 오류');
      errorObj.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
      return next(errorObj);
    }
    res.status(StatusCodes.CREATED).json(results);
  });
};
const login = (req, res, next) => {
  const { email, password } = req.body;

  let sql = `SELECT * FROM users WHERE email = ?`;
  let value = email;
  mariadb.query(sql, value, (err, results) => {
    if (err) {
      const errorObj = new Error('sql 쿼리 오류');
      errorObj.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
      errorObj.stack = err.stack;
      return next(errorObj);
    }
    const user = results[0];
    //일치하는 유저가 없는 경우
    if (!user) {
      //이메일이 다르거나 비밀번호가 다르면 여기서 에러 처리
      const errorObj = new Error('이메일 혹은 비밀번호가 다름');
      errorObj.statusCode = StatusCodes.UNAUTHORIZED;
      return next(errorObj);
    }
    const hashRequestPw = crypto
      .pbkdf2Sync(password, user.salt, 10000, 10, 'sha512')
      .toString('base64');
    //비밀번호 다른 경우
    if (results[0].password !== hashRequestPw) {
      //이메일이 다르거나 비밀번호가 다르면 여기서 에러 처리
      const errorObj = new Error('이메일 혹은 비밀번호가 다름');
      errorObj.statusCode = StatusCodes.UNAUTHORIZED;
      return next(errorObj);
    }
    //jwt 토큰 발행
    const token = jwt.sign(
      { email: results[0].email },
      process.env.JWT_AC_KEY,
      { expiresIn: '5m' }
    );
    //토큰 쿠키에 담기
    console.log('로그인시 발행된 토큰 : ', token);
    res.cookie('token', token, { httpOnly: true });
    return res.status(StatusCodes.OK).json(results);
  });
};

const pwResetRequest = (req, res, next) => {
  const { email } = req.body;

  let sql = `SELECT * FROM users WHERE email = ?`;
  let value = email;
  mariadb.query(sql, value, (error, results) => {
    if (error) {
      const errorObj = new Error('sql 쿼리 오류');
      errorObj.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
      errorObj.stack = error.stack;
      return next(errorObj);
    }
    const foundUser = results[0];
    //유저 없을 때 에러 처리
    if (!foundUser) {
      const errorObj = new Error('해당 이메일이 존재 하지 않음');
      errorObj.statusCode = StatusCodes.UNAUTHORIZED;
      return next(errorObj);
    }
    res.status(StatusCodes.OK).json({ email: foundUser.email });
  });
};
const pwReset = (req, res, next) => {
  const { email, password } = req.body;

  const salt = crypto.randomBytes(10).toString('base64');
  const requestedHashPw = crypto
    .pbkdf2Sync(password, salt, 10000, 10, 'sha512')
    .toString('base64');
  let sql = `UPDATE users SET password = ? , salt = ? WHERE email = ?`;
  let value = [requestedHashPw, salt, email];
  mariadb.query(sql, value, (error, results) => {
    if (error) {
      const errorObj = new Error('sql 쿼리 오류');
      errorObj.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
      return next(errorObj);
    }
    //이메일이 존재하지 않는 경우는 서비스 로직상 고려할 필요 없음.
    return res.status(StatusCodes.OK).json(results);
  });
};
module.exports = { create, login, pwResetRequest, pwReset };
