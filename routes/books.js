const express = require('express');

const router = express.Router();
const { getAllBooks, getBookDetail } = require('../controller/bookController');

router.get('/', getAllBooks);

router.get('/:bookId', getBookDetail);

module.exports = router;
