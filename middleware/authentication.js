const jsonwebtoken = require('jsonwebtoken');
const config = require('../config')


module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jsonwebtoken.verify(token, config.jwt.tokenSecret);
    req.__userId = decodedToken.userId;
    next();
  } catch {
    res.status(401).json({
      error: "Unauthorized!"
    });
  }
};
