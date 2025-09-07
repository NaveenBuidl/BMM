const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    const verifiedtoken = jwt.verify(token, process.env.JWT_SECRET);

    // req.body = {};
    // req.body.userId = verifiedtoken.userId;
    if (req && req.body) {
      req.body.userId = verifiedtoken.userId;
    }

    next();
  } catch (err) {
    res.status(401).send({ success: false, message: "Token Invalid" })
  }
};

module.exports = auth;
