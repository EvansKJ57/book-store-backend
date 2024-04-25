const { StatusCodes } = require('http-status-codes');
const CartService = require('../service/cartService');

const addToCart = async (req, res, next) => {
  try {
    const { bookId, qty } = req.body;
    const user = req.user;
    const results = await CartService.addToCart(user.id, bookId, qty);
    res.status(StatusCodes.CREATED).json(results);
  } catch (error) {
    next(error);
  }
};

const getCarts = async (req, res, next) => {
  try {
    const { selectedItems } = req.body;
    const user = req.user;
    const result = await CartService.getCarts(user.id, selectedItems);
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};

const removeCartItem = async (req, res, next) => {
  try {
    const { cartId } = req.params;
    const user = req.user;
    const results = await CartService.deleteCart(cartId, user.id);
    res.status(StatusCodes.OK).json(results);
  } catch (error) {
    next(error);
  }
};

module.exports = { addToCart, getCarts, removeCartItem };
