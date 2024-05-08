const jwt = require('jsonwebtoken');
const issueAccessToken = ({ userId }) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_AC_KEY, {
    expiresIn: '30m',
    
  });
  return token;
};

const issueRefreshToken = ({ userId, uuid }) => {
  const token = jwt.sign({ id: userId, uuid: uuid }, process.env.JWT_RF_KEY, {
    expiresIn: '1d',
  });
  return token;
};

module.exports = { issueAccessToken, issueRefreshToken };
