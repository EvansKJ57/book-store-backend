import { NextFunction, Request, Response } from 'express';

export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
};
