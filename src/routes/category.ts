import { Router } from 'express';
import CategoryController from '../controller/categoryController';
const router = Router();

router.get('/', CategoryController.getAllCategory);

export default router;
