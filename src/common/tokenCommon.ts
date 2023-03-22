import jwt from "jsonwebtoken";
import config from "../config/config";

const JWT_SECRET = config.MY_SECRET_KEY!;

function generateToken(payload: any, expiresIn: string) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET);
}

const revokedTokens: Record<string, number> = {};

const tokenCommon = {
  generateToken,
  verifyToken,
  revokedTokens,
};

export default tokenCommon;
