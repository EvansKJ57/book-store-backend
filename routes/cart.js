const express = require('express');

const router = express.Router();

const cartController = require('../controller/cartController');

router.post('/', cartController.addToCart);

router.get('/', cartController.getCarts);

router.delete('/:cartId', cartController.removeCartItem);

module.exports = router;
