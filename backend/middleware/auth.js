function auth(req, res, next) {
  const userId = req.headers["x-user-id"]; // or token
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  req.userId = userId;
  next();
}

module.exports = auth;