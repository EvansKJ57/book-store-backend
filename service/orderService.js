const { StatusCodes } = require('http-status-codes');
const CustomError = require('../util/CustomError');

const DeliveriesModel = require('../models/deliveriesModel');
const OrdersModel = require('../models/ordersModel');
const OrderDetailsModel = require('../models/orderDetailsModel');
const CartsService = require('./cartsService');

const postOrder = async (carts, delivery, userId) => {
  try {
    // deliveries 테이블에 넣기
    const deliveriesResult = await DeliveriesModel.insertData(delivery);

    // 방금 생성된 deliveries의 id 갖고 orders 테이블에 넣기
    const ordersResult = await OrdersModel.insertData(
      userId,
      deliveriesResult.insertId
    );
    //장바구니 id로 장바구니 테이블 정보 가져와서 그 데이터와 order의 id를 order_details 테이블에 넣기
    await OrderDetailsModel.insertData(ordersResult.insertId, carts);

    //주문된 카트 물품들을 삭제하는 로직
    await CartsService.deleteCart(carts);

    return ordersResult;
  } catch (error) {
    if (!error.StatusCodes) {
      throw new CustomError(
        '주문 처리 오류',
        StatusCodes.INTERNAL_SERVER_ERROR,
        error
      );
    } else {
      throw error;
    }
  }
};

const getOrdersByUserId = async (userId) => {
  try {
    const ordersData = await OrdersModel.getAllDataByUserId(userId);
    const dataMap = {};
    ordersData.forEach((order) => {
      if (!dataMap[order.id]) {
        dataMap[order.id] = {
          orderId: order.id,
          address: order.address,
          createdAt: order.created_at,
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
    return results;
  } catch (error) {
    throw new CustomError(
      '주문 목록 불러오기 실패',
      StatusCodes.INTERNAL_SERVER_ERROR,
      error
    );
  }
};

module.exports = { postOrder, getOrdersByUserId };
