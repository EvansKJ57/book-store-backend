const mariadb = require('../db/mariadb');

const insertData = async (user_id, delivery_id) => {
  let sql = `INSERT INTO orders (user_id, delivery_id)
        VALUES ("${user_id}", "${delivery_id}");`;

  const [results] = await mariadb.query(sql);
  return results;
};

const getAllDataByUserId = async (userId) => {
  let sql = `SELECT
      orders.id, deliveries.address, orders.created_at, deliveries.receiver,books.id AS book_id,
      books.title, books.price, books.author, order_details.qty
      FROM orders
      LEFT JOIN deliveries
      ON orders.delivery_id = deliveries.id
      LEFT JOIN order_details
      ON orders.id = order_details.order_id
      LEFT JOIN books
      ON books.id = order_details.book_id
      WHERE orders.user_id = "${userId}";`;

  const [queryData] = await mariadb.query(sql);
  // console.log(results);
  return queryData;
};
module.exports = { insertData, getAllDataByUserId };
