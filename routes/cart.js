const express = require('express');

const router = express.Router();

const cartController = require('../controller/cartController');
const verifyAuthorization = require('../middleware/verifyAuthorization');

router.use(verifyAuthorization);

router.post('/', cartController.addToCart);

router.get('/', cartController.getCarts);

router.delete('/:cartId', cartController.removeCartItem);

module.exports = router;
