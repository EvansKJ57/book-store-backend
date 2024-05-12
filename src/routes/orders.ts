import { Router } from 'express';
import orderController from '../controller/orderController';
import { deliveryBodyCheck } from '../middleware/validationRules';
import validationRequest from '../middleware/validateRequest';
import verifyAuth from '../middleware/verifyAuth';

const router = Router();

router.use(verifyAuth);

router.post(
  '/',
  [...deliveryBodyCheck, validationRequest],
  orderController.postOrder
);

router.get('/', orderController.getOrders);

export default router;
