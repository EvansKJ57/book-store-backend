const express = require('express');
const router = express.Router();
const { addLike, removeLike } = require('../controller/likeController');
const verifyAuth = require('../middleware/verifyAuth');

router.use(verifyAuth);

router.post('/:bookId', addLike);

router.delete('/:bookId', removeLike);

module.exports = router;
