const { StatusCodes } = require('http-status-codes');
const mariadb = require('../db/mariadb');
const CustomError = require('../util/CustomError');

const postOrder = async (req, res, next) => {
  try {
    const { carts, delivery, userId } = req.body;

    // deliveries 테이블에 넣기
    let sql = `INSERT INTO deliveries (address, receiver, contact)
        VALUES ("${delivery.address}", "${delivery.receiver}", "${delivery.contact}")`;

    const [insertDeliveries] = await mariadb.query(sql);
    // console.log(insertDeliveries.insertId);

    // 방금 생성된 deliveries의 id 갖고 orders 테이블에 넣기
    sql = `INSERT INTO orders (user_id, delivery_id)
        VALUES ("${userId}", "${insertDeliveries.insertId}");`;

    const [insertOrders] = await mariadb.query(sql);
    // console.log(insertOrders.insertId);

    //장바구니 id로 장바구니 테이블 정보 가져와서 그 데이터와 order의 id를 order_details 테이블에 넣기
    sql = `INSERT INTO order_details (order_id, book_id, qty)
      SELECT "${insertOrders.insertId}", book_id, qty FROM carts
      WHERE carts.id IN (${carts})`;

    const [insertOrderDetails] = await mariadb.query(sql);
    // console.log(insertDeliveries);

    //주문된 카트 물품들을 삭제하는 로직
    sql = `DELETE FROM carts WHERE id IN (${carts})`;
    await mariadb.query(sql);

    res.status(StatusCodes.OK).json({ orderId: insertOrders.insertId });
  } catch (error) {
    next(
      new CustomError(
        '주문 처리 오류',
        StatusCodes.INTERNAL_SERVER_ERROR,
        error
      )
    );
  }
};

const getOrders = async (req, res, next) => {
  try {
    const { userId } = req.body;
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

    const dataMap = {};
    queryData.forEach((order) => {
      if (!dataMap[order.id]) {
        dataMap[order.id] = {
          orderId: order.id,
          address: order.address,
          created_at: order.created_at,
          receiver: order.receiver,
          totalPrice: order.price * order.qty,
          totalQty: order.qty,
          orderedBooks: [
            {
              id: order.book_id,
              title: order.title,
              price: order.price,
              author: order.author,
              qty: order.qty,
            },
          ],
        };
      } else {
        dataMap[order.id].orderedBooks.push({
          id: order.book_id,
          title: order.title,
          price: order.price,
          author: order.author,
          qty: order.qty,
        });
        dataMap[order.id].totalPrice += order.price * order.qty;
        dataMap[order.id].totalQty += order.qty;
      }
    });

    const results = Object.values(dataMap);

    res.status(200).json(results);
  } catch (error) {
    next(
      new CustomError(
        '주문 목록 불러오기 실패',
        StatusCodes.INTERNAL_SERVER_ERROR,
        error
      )
    );
  }
};

module.exports = { postOrder, getOrders };
