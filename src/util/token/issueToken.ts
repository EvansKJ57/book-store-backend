import jwt from 'jsonwebtoken';
interface UserPayload {
  userId: number;
}

interface RefreshPayload extends UserPayload {
  uuid: string;
}
export const issueAccessToken = ({ userId }: UserPayload) => {
  const JWT_AC_KEY = process.env.JWT_AC_KEY!;
  const token = jwt.sign({ id: userId }, JWT_AC_KEY, {
    expiresIn: '30m',
  });
  return token;
};

export const issueRefreshToken = ({ userId, uuid }: RefreshPayload) => {
  const JWT_RF_KEY = process.env.JWT_RF_KEY!;
  const token = jwt.sign({ id: userId, uuid: uuid }, JWT_RF_KEY, {
    expiresIn: '1d',
  });
  return token;
};
