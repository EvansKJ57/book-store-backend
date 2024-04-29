const express = require('express');

const bookController = require('../controller/bookController');
const verifyAuth = require('../middleware/verifyAuth');

const router = express.Router();

router.use(verifyAuth);

router.get('/', bookController.getAllBooks);
router.get('/:bookId', bookController.getBookDetail);

module.exports = router;
