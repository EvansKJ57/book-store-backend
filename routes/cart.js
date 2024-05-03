const express = require('express');
const router = express.Router();

const cartController = require('../controller/cartController');
const { cartIdParamsCheck } = require('../middleware/validationRules');
const validateRequest = require('../middleware/validateRequest');
const verifyAuth = require('../middleware/verifyAuth');

router.use(verifyAuth);

router.post('/', cartController.addToCart);

router.get('/', cartController.getCarts);

router.delete(
  '/:cartId',
  [cartIdParamsCheck, validateRequest],
  cartController.removeCartItem
);

module.exports = router;
