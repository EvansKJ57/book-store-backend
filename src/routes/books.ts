import { Router } from 'express';
import bookController from '../controller/bookController';
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
  bookController.getAllBooks
);
router.get(
  '/:bookId',
  [...bookIdParamsCheck, validationRequest],
  bookController.getBookDetail
);

export default router;
