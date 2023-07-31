const jwt = require("jsonwebtoken");

const dotenv = require("dotenv");
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

const { User } = require("../models/user");

function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (typeof authHeader !== "string") {
    return res.status(401).json({ error: "No token provided" });
  }

  const [bearer, token] = authHeader.split(` `, 2);

  if (bearer !== `Bearer`) {
    return res.status(401).json({ error: "No token provided" });
  }

  jwt.verify(token, JWT_SECRET, async (err, decode) => {
    if (err) {
      if (
        err.name === "TokenExpiredError" ||
        err.name === "JsonWebTokenError"
      ) {
        return res.status(401).json({ error: "Not authorized" });
      }
      return next(err);
    }
    try {
      const user = await User.findById(decode.id);
      if (user === null) {
        return res.status(401).json({ error: "Not authorized" });
      }
      if (user.token === null) {
        return res.status(401).json({ error: "Not authorized" });
      }
      if (user.verify !== true) {
        return res.status(401).json({ error: "Not verified user" });
      }
      req.user = { id: decode.id };
      next();
    } catch (error) {
      return next(error);
    }
  });
}

module.exports = auth;
