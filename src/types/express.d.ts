import { JwtPayload } from 'jsonwebtoken';

declare global {
  namespace Express {
    export interface Request {
      user: {
        id: number;
        email?: string;
      } & jwt.JwtPayload;
    }
  }
}
