const jwt = require('jsonwebtoken');

const jwtSecret = process.env.JWT_SECRET || 'secret_key';

const jwtTokenAuth = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Access Denied' });
  
    jwt.verify(token, jwtSecret, (err, user) => {
      if (err) return res.status(403).json({ message: 'Invalid Token' });
      req.user = user;
      next();
    });
  };

module.exports = {jwtTokenAuth, jwtSecret};
