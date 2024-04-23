const { StatusCodes } = require('http-status-codes');
const OrderService = require('../service/orderService');

const postOrder = async (req, res, next) => {
  try {
    const { carts, delivery } = req.body;
    const user = req.user;
    const results = await OrderService.postOrder(carts, delivery, user.id);

    res.status(StatusCodes.OK).json({ orderId: results.insertId });
  } catch (error) {
    next(error);
  }
};

const getOrders = async (req, res, next) => {
  try {
    const user = req.user;
    const results = await OrderService.getOrdersByUserId(user.id);

    res.status(StatusCodes.OK).json(results);
  } catch (error) {
    next(error);
  }
};

module.exports = { postOrder, getOrders };
