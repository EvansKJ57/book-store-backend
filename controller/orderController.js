const { StatusCodes } = require('http-status-codes');
const OrderService = require('../service/orderService');

const postOrder = async (req, res, next) => {
  try {
    const { carts, delivery, userId } = req.body;
    const results = await OrderService.postOrder(carts, delivery, userId);

    res.status(StatusCodes.OK).json({ orderId: results.insertId });
  } catch (error) {
    next(error);
  }
};

const getOrders = async (req, res, next) => {
  try {
    const { userId } = req.body;
    const results = await OrderService.getOrdersByUserId(userId);

    res.status(StatusCodes.OK).json(results);
  } catch (error) {
    next(error);
  }
};

module.exports = { postOrder, getOrders };
