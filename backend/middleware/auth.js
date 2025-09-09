const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/jwt');

function auth(requiredRoles = []) {
  return (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    if(!token) return res.status(401).json({error:'No token'});
    try {
      const payload = jwt.verify(token, jwtSecret);
      req.user = payload;
      if(requiredRoles.length && !requiredRoles.includes(payload.role)) {
        return res.status(403).json({error:'Forbidden'});
      }
      next();
    } catch(e) {
      return res.status(401).json({error:'Invalid token'});
    }
  }
}

module.exports = auth;
