const express = require('express');
const dotenv = require('dotenv');
const app = express();

const usersRoutes = require('./routes/users');
const booksRoutes = require('./routes/books');
const likesRoutes = require('./routes/likes');
const orderRoutes = require('./routes/orders');
const cartRoutes = require('./routes/cart');

app.use(express.json());
dotenv.config();

app.use('/users', usersRoutes);
app.use('/books', booksRoutes);
app.use('/likes', likesRoutes);
app.use('/orders', orderRoutes);
app.use('/cart', cartRoutes);

app.use((error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  const msg = error.message || '서버 내부 오류가 발생했습니다.';
  console.log('------------서버 에러 미들웨어--------------');
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
