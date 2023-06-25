const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET.toString());
    req.user = decoded;
    next();
  } catch (error) {
    return res.sendStatus(401);
  }
}

module.exports = verifyToken;
