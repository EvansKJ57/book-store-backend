import { Router } from 'express';
import CartController from '../controller/cartController';
import { cartIdParamsCheck } from '../middleware/validationRules';
import validationRequest from '../middleware/validateRequest';
import verifyAuth from '../middleware/verifyAuth';

const router = Router();

router.use(verifyAuth);

router.post('/', CartController.addToCart);

router.get('/', CartController.getCarts);

router.delete(
  '/:cartId',
  [...cartIdParamsCheck, validationRequest],
  CartController.removeCartItem
);

export default router;
