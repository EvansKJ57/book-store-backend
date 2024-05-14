import { Router } from 'express';
import categoryController from '../controller/categoryController';
const router = Router();

router.get('/', categoryController.getAllCategory);

export default router;
