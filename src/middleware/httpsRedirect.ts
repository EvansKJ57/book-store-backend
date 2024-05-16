import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export const redirectHttps = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.secure) {
    return next();
  }
  res.redirect(
    StatusCodes.PERMANENT_REDIRECT,
    `https://${req.hostname}:${process.env.HTTPS_PORT}${req.url}`
  );
};
