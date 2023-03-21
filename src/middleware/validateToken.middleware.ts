import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "../config/config";
import tokenCommon from "../common/tokenCommon";

const validateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Token is required" });
  }

  const token: string = authHeader.split(" ")[1];

  try {
    jwt.verify(token, `${config.MY_SECRET_KEY}`);

    const tokenExpiration = tokenCommon.revokedTokens[token];
    if (tokenExpiration && tokenExpiration > Date.now()) {
      return res.status(401).json({ message: "Token has been revoked" });
    }
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

export default validateToken;
