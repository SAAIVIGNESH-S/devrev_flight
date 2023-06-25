const jwt = require("jsonwebtoken");

function checkToken(req, res, next) {
  const {token} = req.body;

  if (token == null) return res.sendStatus(401);

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET.toString());
    return res.status(200).json({ role: decoded["role"] });
  } catch (error) {
    console.log(error);
    return res.sendStatus(401);
  }
}

module.exports = checkToken;
