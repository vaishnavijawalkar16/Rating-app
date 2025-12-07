import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  let token = req.headers["authorization"];
  if (!token) return res.status(403).send("Access denied");

  jwt.verify(token, "secret123", (err, decoded) => {
    if (err) return res.status(401).send("Invalid token");
    req.user = decoded;
    next();
  });
};
