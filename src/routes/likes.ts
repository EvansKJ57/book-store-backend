import { Router } from 'express';
import LikeController from '../controller/likeController';
import { bookIdParamsCheck } from '../middleware/validationRules';
import validationRequest from '../middleware/validateRequest';
import verifyAuth from '../middleware/verifyAuth';

const router = Router();

router.use(verifyAuth);

router.post(
  '/:bookId',
  [...bookIdParamsCheck, validationRequest],
  LikeController.addLike
);

router.delete(
  '/:bookId',
  [...bookIdParamsCheck, validationRequest],
  LikeController.removeLike
);

export default router;
