const express = require('express');

const router = express.Router();

const orderController = require('../controller/orderController');
const verifyAuth = require('../middleware/verifyAuth');

router.use(verifyAuth);

router.post('/', orderController.postOrder);

router.get('/', orderController.getOrders);

module.exports = router;
