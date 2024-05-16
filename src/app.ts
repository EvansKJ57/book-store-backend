import express, { Application } from 'express';
import fs from 'fs';
import http from 'http';
import https from 'https';
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
import { redirectHttps } from './middleware/httpsRedirect';
import { errorHandler } from './middleware/errorHandler';

//http로 요청오면 https으로 리다이렉트
app.use(redirectHttps);

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

//에러 핸들러
app.use(errorHandler);

const httpsOptions = {
  key: fs.readFileSync(process.env.SSL_KEY),
  cert: fs.readFileSync(process.env.SSL_CERT),
};

const httpsServer = https.createServer(httpsOptions, app);
const httpServer = http.createServer(app);

httpsServer.listen(process.env.HTTPS_PORT, () => {
  console.log(`HTTPS Server is running on port ${process.env.HTTPS_PORT}`);
});
httpServer.listen(process.env.HTTP_PORT, () => {
  console.log(`HTTP Server is running on port ${process.env.HTTP_PORT}`);
});
