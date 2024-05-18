import { StatusCodes } from 'http-status-codes';
import OrderService from '../service/orderService';
import { NextFunction, Request, Response } from 'express';
import { IOrderReqBody } from '../types/ReqRelatedType';

const OrderController = {
  postOrder: async (
    req: Request<{}, {}, IOrderReqBody>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { carts, delivery } = req.body;
      const user = req.user;
      const results = await OrderService.postOrder(carts, delivery, user.id);

      res.status(StatusCodes.CREATED).json({ orderId: results.insertId });
    } catch (error) {
      next(error);
    }
  },

  getOrders: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      const results = await OrderService.getOrdersByUserId(user.id);

      res.status(StatusCodes.OK).json(results);
    } catch (error) {
      next(error);
    }
  },
};
export default OrderController;
