import { Router } from 'express';
import BookController from '../controller/bookController';
import {
  bookIdParamsCheck,
  bookQueryCheck,
} from '../middleware/validationRules';
import validationRequest from '../middleware/validateRequest';
import verifyAuth from '../middleware/verifyAuth';
const router = Router();

router.use(verifyAuth);

router.get(
  '/',
  [...bookQueryCheck, validationRequest],
  BookController.getAllBooks
);
router.get(
  '/:bookId',
  [...bookIdParamsCheck, validationRequest],
  BookController.getBookDetail
);

export default router;
