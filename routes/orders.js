const express = require('express');
const router = express.Router();

const orderController = require('../controller/orderController');
const { deliveryBodyCheck } = require('../middleware/validationRules');
const validateRequest = require('../middleware/validateRequest');
const verifyAuth = require('../middleware/verifyAuth');

router.use(verifyAuth);

router.post(
  '/',
  [deliveryBodyCheck, validateRequest],
  orderController.postOrder
);

router.get('/', orderController.getOrders);

module.exports = router;
