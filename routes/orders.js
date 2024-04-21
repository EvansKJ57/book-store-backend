const express = require('express');

const router = express.Router();

const orderController = require('../controller/orderController');

router.post('/', orderController.postOrder);

router.get('/', orderController.getOrders);

module.exports = router;
