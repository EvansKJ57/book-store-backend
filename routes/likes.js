const express = require('express');
const router = express.Router();
const { addLike, removeLike } = require('../controller/likesController');

router.post('/:bookId', addLike);

router.delete('/:bookId', removeLike);

module.exports = router;
