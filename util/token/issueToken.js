const jwt = require('jsonwebtoken');

const issueAccessToken = (email, id) => {
  const token = jwt.sign({ email: email, id: id }, process.env.JWT_AC_KEY, {
    expiresIn: '30m',
  });
  return token;
};

const issueRefreshToken = (email, id) => {
  const token = jwt.sign({ email: email, id: id }, process.env.JWT_RF_KEY, {
    expiresIn: '1d',
  });
  return token;
};

module.exports = { issueAccessToken, issueRefreshToken };
