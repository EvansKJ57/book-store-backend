const express = require('express');

const router = express.Router();
const bookController = require('../controller/bookController');

router.get('/', bookController.getAllBooks);

router.get('/:bookId', bookController.getBookDetail);

module.exports = router;
