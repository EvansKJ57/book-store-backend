const express = require('express');
const router = express.Router();

const { addLike, removeLike } = require('../controller/likeController');
const { bookIdParamsCheck } = require('../middleware/validationRules');
const validateRequest = require('../middleware/validateRequest');
const verifyAuth = require('../middleware/verifyAuth');

router.use(verifyAuth);

router.post('/:bookId', [bookIdParamsCheck, validateRequest], addLike);

router.delete('/:bookId', [bookIdParamsCheck, validateRequest], removeLike);

module.exports = router;
