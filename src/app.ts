import express, { Request, Response, NextFunction, Application } from 'express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import cors from 'cors';
import dotenv from 'dotenv';
const app: Application = express();
dotenv.config();

import usersRoutes from './routes/users';
import booksRoutes from './routes/books';
import likesRoutes from './routes/likes';
import orderRoutes from './routes/orders';
import cartRoutes from './routes/cart';
import categoriesRoutes from './routes/category';
import authRoutes from './routes/auth';

app.use(helmet());
app.use(cors({ origin: process.env.ORIGIN_URL, credentials: true }));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use('/category', categoriesRoutes);
app.use('/users', usersRoutes);
app.use('/books', booksRoutes);
app.use('/likes', likesRoutes);
app.use('/orders', orderRoutes);
app.use('/cart', cartRoutes);
app.use('/auth', authRoutes);

app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = error.statusCode || 500;
  const msg = error.message || '서버 내부 오류가 발생했습니다.';
  console.log(
    '------------중앙 에러 처리 미들웨어 (',
    new Date().toLocaleString('KR-seoul'),
    ') --------------'
  );
  console.error(
    '< 에러메세지 >>>> ',
    error.message,
    ' / < 상태 코드 >>>> ',
    error.statusCode
  );
  console.error('< 에러 스택 >>>>>', error.stack);

  return res.status(statusCode).json({ message: msg });
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
