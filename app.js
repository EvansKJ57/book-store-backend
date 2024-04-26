const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const app = express();

const usersRoutes = require('./routes/users');
const booksRoutes = require('./routes/books');
const likesRoutes = require('./routes/likes');
const orderRoutes = require('./routes/orders');
const cartRoutes = require('./routes/cart');
const categoriesRoutes = require('./routes/category');
const authRoutes = require('./routes/auth');

app.use(express.json());
app.use(cookieParser());
dotenv.config();

app.use('/category', categoriesRoutes);
app.use('/users', usersRoutes);
app.use('/books', booksRoutes);
app.use('/likes', likesRoutes);
app.use('/orders', orderRoutes);
app.use('/cart', cartRoutes);
app.use('/auth', authRoutes);

app.use((error, req, res, next) => {
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

app.listen(process.env.PORT);
