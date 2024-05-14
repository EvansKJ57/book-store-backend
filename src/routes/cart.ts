import { Router } from 'express';
import cartController from '../controller/cartController';
import { cartIdParamsCheck } from '../middleware/validationRules';
import validationRequest from '../middleware/validateRequest';
import verifyAuth from '../middleware/verifyAuth';

const router = Router();

router.use(verifyAuth);

router.post('/', cartController.addToCart);

router.get('/', cartController.getCarts);

router.delete(
  '/:cartId',
  [...cartIdParamsCheck, validationRequest],
  cartController.removeCartItem
);

export default router;
