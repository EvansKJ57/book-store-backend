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
    sql = `INSERT INTO orders ( user_id, delivery_id)
        VALUES ("${userId}", "${insertDeliveries.insertId}");`;

    const [insertOrders] = await mariadb.query(sql);
    // console.log(insertOrders.insertId);

    //장바구니 id로 장바구니 테이블 정보 가져와서 그 데이터와 order의 id를 order_details 테이블에 넣기
    sql = `INSERT INTO order_details (order_id, book_id, qty)
    SELECT "${insertOrders.insertId}", book_id, qty FROM carts
    WHERE carts.id IN (${carts})`;

    const [insertOrderDetails] = await mariadb.query(sql);
    // console.log(insertDeliveries);

    //주문된 카트 물품들을 삭제하는 로직이 추가로 필요함...
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

const getOrders = async (req, res, next) => {};

module.exports = { postOrder, getOrders };
