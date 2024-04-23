const express = require('express');

const bookController = require('../controller/bookController');
const optionalVerifyAuth = require('../middleware/optionalVerifyAuth');

const router = express.Router();

router.get('/', bookController.getAllBooks);

// 도서 세부사항에 liked는 유저가 좋아요 표시했는지 확인한 것이기 때문에
// 로그인 안해도 보여줄 수 있도록 optionalVerifyAuth 미들웨어를 사용함
router.get('/:bookId', optionalVerifyAuth, bookController.getBookDetail);

module.exports = router;
