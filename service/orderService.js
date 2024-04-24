const { StatusCodes } = require('http-status-codes');
const CustomError = require('../util/CustomError');

const OrdersModel = require('../models/ordersModel');
const postOrderTransaction = require('../models/transaction/postOrderTransaction');

const postOrder = async (carts, delivery, userId) => {
  try {
    const results = await postOrderTransaction(carts, delivery, userId);
    return results;
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
    const ordersData = await OrdersModel.getOrdersByUserId(userId);
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
