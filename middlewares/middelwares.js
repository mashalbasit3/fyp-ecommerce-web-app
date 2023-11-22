import jwt from "jsonwebtoken"

export const verifyToken = (req, res, next) => {
    let token = req.cookies.jwt;
  
    if (!token) {
      return res.status(403).send("A token is required for authentication");
    }
    try {
      const payload = jwt.verify(token, process.env.SECRET);
      req.user = payload;
    } catch (err) {
      return res.status(401).send("Invalid Token");
    }
    return next();
  };
  

  