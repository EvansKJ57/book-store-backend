const express = require('express');

const router = express.Router();

const { postOrder, getOrders } = require('../controller/order-controller');

router.post('/', postOrder);

router.get('/', getOrders);

module.exports = router;
