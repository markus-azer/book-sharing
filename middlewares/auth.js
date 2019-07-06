const jwt = require('jsonwebtoken');

const { User } = global.models;
const { JWT_SECRET_TOKEN } = serverConfig;

const authenticate = async(req, res, next) => {
  try {
    const accessToken = req.headers['x-access-token'];

    if (empty(accessToken))
      throw new CustomError(`Access Denied`, 401);

    try {
      const verifyToken = jwt.verify(accessToken, JWT_SECRET_TOKEN);
      const user = await User.findOne({id: verifyToken.id}).lean();
      
      if(empty(user))
        throw new CustomError(`Invalid Token`, 400);

      req.user = user;
    } catch (err) {
      throw new CustomError(`Invalid Token`, 400);
    }

    return next();
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  authenticate
};