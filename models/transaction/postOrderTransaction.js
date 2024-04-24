const mariadb = require('../../db/mariadb');

const DeliveriesModel = require('../deliveriesModel');
const OrdersModel = require('../ordersModel');
const OrderDetailsModel = require('../orderDetailsModel');
const CartsModel = require('../cartsModel');

const postOrderTransaction = async (carts, delivery, userId) => {
  const conn = await mariadb.getConnection();
  try {
    await conn.beginTransaction();
    // deliveries 테이블에 넣기
    const deliveriesResult = await DeliveriesModel.insertData(delivery, conn);
    // 방금 생성된 deliveries의 id 갖고 orders 테이블에 넣기
    const ordersResult = await OrdersModel.insertData(
      userId,
      deliveriesResult.insertId,
      conn
    );
    //장바구니 id로 장바구니 테이블 정보 가져와서 그 데이터와 order의 id를 order_details 테이블에 넣기
    const orderDetailResult = await OrderDetailsModel.insertData(
      ordersResult.insertId,
      carts,
      conn
    );
    if (orderDetailResult.affectedRows !== carts.length) {
      throw new Error('order_detail 테이블 query 실패');
    }
    //주문된 카트 물품들을 삭제하는 로직
    const cartsResult = await CartsModel.deleteCart(carts, userId, conn);
    //위에 order_detail에서 잡아낼거지만 일단 keep...
    if (cartsResult.affectedRows !== carts.length) {
      throw new Error('carts 테이블 저장 실패');
    }
    await conn.commit();
    return ordersResult;
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
};

module.exports = postOrderTransaction;
