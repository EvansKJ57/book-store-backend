import { StatusCodes } from 'http-status-codes';
import CustomError from '../util/CustomError';
import { IDelivery, IOrderResData } from '../types/customTypes';
import OrdersModel from '../models/ordersModel';
import postOrderTransaction from '../models/transaction/postOrderTransaction';

const OrderService = {
  postOrder: async (carts: number[], delivery: IDelivery, userId: number) => {
    try {
      const results = await postOrderTransaction(carts, delivery, userId);
      return results;
    } catch (error: any) {
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
  },

  getOrdersByUserId: async (userId: number) => {
    try {
      const ordersData = await OrdersModel.getOrdersByUserId(userId);
      const dataMap: IOrderResData = {};
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
    } catch (error: any) {
      throw new CustomError(
        '주문 목록 불러오기 실패',
        StatusCodes.INTERNAL_SERVER_ERROR,
        error
      );
    }
  },
};
export default OrderService;
