const jwt = require("jsonwebtoken");

exports.validateUser = async (req, res, next) => {
  const authHeader = req.header("Authorization");
  const token = authHeader && authHeader.split(" ")[1];

  try {
    if (!token) {
      res
        .status(401)
        .send({ error: "Please authenticate using a valid token" });
    }
    const data = jwt.verify(token, process.env.JWT_SECRET);

    req.user = data;
    next();
  } catch (error) {
    res.status(402).send({ error: "Please authenticate using a valid token" });
  }
};
