import { Router } from 'express';
import OrderController from '../controller/orderController';
import { deliveryBodyCheck } from '../middleware/validationRules';
import validationRequest from '../middleware/validateRequest';
import verifyAuth from '../middleware/verifyAuth';

const router = Router();

router.use(verifyAuth);

router.post(
  '/',
  [...deliveryBodyCheck, validationRequest],
  OrderController.postOrder
);

router.get('/', OrderController.getOrders);

export default router;
