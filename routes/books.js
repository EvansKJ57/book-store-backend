const express = require('express');
const router = express.Router();

const bookController = require('../controller/bookController');
const {
  bookIdParamsCheck,
  bookQueryCheck,
} = require('../middleware/validationRules');
const validateRequest = require('../middleware/validateRequest');
const verifyAuth = require('../middleware/verifyAuth');

router.use(verifyAuth);

router.get('/', [bookQueryCheck, validateRequest], bookController.getAllBooks);
router.get(
  '/:bookId',
  [bookIdParamsCheck, validateRequest],
  bookController.getBookDetail
);

module.exports = router;
