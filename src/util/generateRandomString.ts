import crypto from 'crypto';

const generateRandomString = (
  length: number,
  encoding: BufferEncoding = 'hex'
) => {
  return crypto.randomBytes(length).toString(encoding);
};

export default generateRandomString;
