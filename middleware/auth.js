const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    const header = req.headers.authorization;

    if (!header) {
      return res.status(401).json({ message: "No token" });
    }

    const token = header.split(" ")[1]; // 🔥 Bearer TOKEN
    const decoded = jwt.verify(token, "secretkey");

    req.userId = decoded.id; // ✅ yahi missing tha

    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authMiddleware;