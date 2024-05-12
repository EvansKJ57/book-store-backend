import { JwtPayload } from 'jsonwebtoken';

declare global {
  namespace Express {
    export interface Request {
      user?: {
        id: number | null;
        email?: string;
      } & JwtPayload;
    }
  }
}
