const express = require('express');

const router = express.Router();

const {
  addToCart,
  removeCartItem,
  getCarts,
} = require('../controller/cart-controller');

router.post('/', addToCart);

router.get('/', getCarts);

router.delete('/:cartId', removeCartItem);

module.exports = router;
