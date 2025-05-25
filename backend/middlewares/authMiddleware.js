const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  const accessToken = req.cookies.accessToken;

  if (!accessToken) return res.status(401).json({ message: "Unauthorized. No access token provided." });

  jwt.verify(accessToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Access token expired. Please refresh token." });
    }

    req.user = decoded;
    next();
  });
};

module.exports = { authenticate };
