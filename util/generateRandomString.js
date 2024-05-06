const crypto = require('crypto');

const generateRandomString = (length, encoding = 'hex') => {
  return crypto.randomBytes(length).toString(encoding);
};

module.exports = generateRandomString;
