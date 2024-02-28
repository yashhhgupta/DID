const jwt = require("jsonwebtoken");

const validateAdminToken = (req, res, next) => {
  const { TokenExpiredError } = jwt;

  const catchError = (error, res) => {
    return res
      .status(401)
      .json({ message: "Unauthorized! Please login as an admin" });
  };

  const tokenHeader = req.headers.authorization;

  if (!tokenHeader) {
    return res.status(403).json({
      error: "Not able to identify the token or token not provided",
    });
  }

  const token = tokenHeader.split(" ")[1];

  if (!token) {
    return res.status(403).json({
      error: "Not able to identify the token or token not provided",
    });
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (decoded && decoded.role === "Admin") {
      next();
    } else {
      return catchError(err, res);
    }
  });
};

module.exports = { validateAdminToken };
