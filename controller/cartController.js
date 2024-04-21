const { StatusCodes } = require('http-status-codes');
const CartService = require('../service/cartsService');

const addToCart = async (req, res, next) => {
  try {
    const { userId, bookId, qty } = req.body;
    const results = await CartService.addToCart(userId, bookId, qty);
    res.status(StatusCodes.OK).json(results);
  } catch (error) {
    next(error);
  }
};

const getCarts = async (req, res, next) => {
  try {
    const { userId, selectedItems } = req.body;

    const result = await CartService.getCarts(userId, selectedItems);
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};

const removeCartItem = async (req, res, next) => {
  try {
    const { cartId } = req.params;

    const results = await CartService.deleteCart(cartId);
    res.status(StatusCodes.OK).json(results);
  } catch (error) {
    next(error);
  }
};

module.exports = { addToCart, getCarts, removeCartItem };
