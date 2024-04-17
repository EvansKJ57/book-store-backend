const { StatusCodes } = require('http-status-codes');
const mariadb = require('../db/mariadb');
const CustomError = require('../util/CustomError');

const addToCart = async (req, res, next) => {
  try {
    const { userId, bookId, qty } = req.body;

    let sql = `INSERT INTO carts (user_id, book_id, qty) 
    VALUES ("${userId}", "${bookId}", "${qty}")`;
    const [results] = await mariadb.query(sql);
    res.status(StatusCodes.OK).json(results);
  } catch (error) {
    next(new CustomError('sql 오류', StatusCodes.INTERNAL_SERVER_ERROR, error));
  }
};

const getCarts = async (req, res, next) => {
  try {
    const { userId, selectedItems } = req.body;

    let sql = `SELECT 
      carts.id AS cart_id, books.id, books.title, books.summary, books.price, carts.qty
      FROM carts 
      LEFT JOIN books ON carts.book_id = books.id`;
    const conditions = [`user_id = "${userId}"`];

    //선택한 카트 아이템이 있는 경우
    if (selectedItems) {
      conditions.push(` carts.id IN (${selectedItems})`);
    }
    // sql문 조건 취합해서 추가하기
    if (conditions) {
      const condition = conditions.join(' AND ');
      sql += ` WHERE ${condition}`;
    }

    const [results] = await mariadb.query(sql);
    if (results.length === 0) {
      return next(
        new CustomError('카트에 담긴 도서 없음', StatusCodes.NOT_FOUND)
      );
    }
    res.status(StatusCodes.OK).json(results);
  } catch (error) {
    next(new CustomError('sql 오류', StatusCodes.INTERNAL_SERVER_ERROR, error));
  }
};

const removeCartItem = async (req, res, next) => {
  try {
    const { cartId } = req.params;
    console.log(cartId);

    let sql = `DELETE FROM carts WHERE id = "${Number(cartId)}"`;

    const [results] = await mariadb.query(sql);
    res.status(StatusCodes.OK).json(results);
  } catch (error) {
    next(new CustomError('sql 오류', StatusCodes.INTERNAL_SERVER_ERROR, error));
  }
};

module.exports = { addToCart, getCarts, removeCartItem };