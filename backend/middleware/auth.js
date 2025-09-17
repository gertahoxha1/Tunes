const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ error: "Access denied, no token provided" });

  try {
    const decoded = jwt.verify(token, "secret123");
    req.userId = decoded.id; 
    next();
  } catch (err) {
    res.status(403).json({ error: "Invalid token" });
  }
};
