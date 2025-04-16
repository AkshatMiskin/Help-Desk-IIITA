const jwt = require('jsonwebtoken');
const SECRET_KEY = "your_secret_key";

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ success: false, message: "Token missing" });

  jwt.verify(token.split(" ")[1], SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).json({ success: false, message: "Invalid token" });
    req.user = decoded;
    next();
  });
};

module.exports = verifyToken;
