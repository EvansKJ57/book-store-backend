import { Router } from 'express';
import likeController from '../controller/likeController';
import { bookIdParamsCheck } from '../middleware/validationRules';
import validationRequest from '../middleware/validateRequest';
import verifyAuth from '../middleware/verifyAuth';

const router = Router();

router.use(verifyAuth);

router.post(
  '/:bookId',
  [...bookIdParamsCheck, validationRequest],
  likeController.addLike
);

router.delete(
  '/:bookId',
  [...bookIdParamsCheck, validationRequest],
  likeController.removeLike
);

export default router;
