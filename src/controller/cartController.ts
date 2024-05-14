import { StatusCodes } from 'http-status-codes';
import CartService from '../service/cartService';
import { NextFunction, Request, Response } from 'express';

const addToCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { bookId, qty } = req.body;
    const user = req.user;
    const results = await CartService.addToCart(user.id, bookId, qty);
    res.status(StatusCodes.CREATED).json(results);
  } catch (error) {
    next(error);
  }
};

const getCarts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { selectedItems } = req.body;
    const user = req.user;
    const result = await CartService.getCarts(Number(user.id), selectedItems);
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};

const removeCartItem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const cartId: number[] = [Number(req.params.cartId)];
    const user = req.user;
    const results = await CartService.deleteCart(cartId, user.id);
    res.status(StatusCodes.OK).json(results);
  } catch (error) {
    next(error);
  }
};

export default { addToCart, getCarts, removeCartItem };
